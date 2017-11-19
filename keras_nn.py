import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Convolution2D, MaxPooling2D
from keras.optimizers import Adam
from keras.regularizers import l2
from keras.utils import np_utils
from keras.utils import to_categorical
from sklearn import metrics
import glob
import os
import librosa
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from matplotlib.pyplot import specgram
import librosa.display
from sklearn.metrics import precision_recall_fscore_support
import math

# to run this code, you'll need to load the following data:
# train_x, train_y
# valid_x, valid_y
# test_x, test_y
# see http://aqibsaeed.github.io/2016-09-24-urban-sound-classification-part-2/ for details

def windows(data, window_size):
    start = 0
    while start < len(data):
        yield start, start + window_size
        start += (window_size / 2)

def extract_features(parent_dir,sub_dirs,file_ext="*.wav",bands = 60, frames = 41):
    window_size = 512 * (frames - 1)
    log_specgrams = []
    labels = []
    for l, sub_dir in enumerate(sub_dirs):
        for fn in glob.glob(os.path.join(parent_dir, sub_dir, file_ext)):
            sound_clip,s = librosa.load(fn)
            label = fn.split('/')[2].split('-')[1]
            for (start,end) in windows(sound_clip,window_size):
                if(len(sound_clip[start:end]) == window_size):
                    signal = sound_clip[start:end]
                    melspec = librosa.feature.melspectrogram(signal, n_mels = bands)
                    logspec = librosa.logamplitude(melspec)
                    logspec = logspec.T.flatten()[:, np.newaxis].T
                    log_specgrams.append(logspec)
                    labels.append(label)

    log_specgrams = np.asarray(log_specgrams).reshape(len(log_specgrams),bands,frames,1)
    features = np.concatenate((log_specgrams, np.zeros(np.shape(log_specgrams))), axis = 3)
    for i in range(len(features)):
        features[i, :, :, 1] = librosa.feature.delta(features[i, :, :, 0])

    return np.array(features), np.array(labels,dtype = np.int)

def one_hot_encode(labels):
    n_labels = len(labels)
    n_unique_labels = len(np.unique(labels))
    one_hot_encode = np.zeros((n_labels,n_unique_labels))
    one_hot_encode[np.arange(n_labels), labels] = 1
    return one_hot_encode

parent_dir = 'UrbanSound'
tr_sub_dirs = ["fold1test","fold2test"]
tr_features,tr_labels = extract_features(parent_dir,tr_sub_dirs)
#tr_labels = one_hot_encode(tr_labels)
tr_labels = to_categorical(tr_labels,num_classes=10)
train_x = tr_features
train_y = tr_labels


vl_sub_dirs = ["fold1test","fold2test"]
vl_features,vl_labels = extract_features(parent_dir,vl_sub_dirs)
#vl_labels = one_hot_encode(vl_labels)
vl_labels = to_categorical(vl_labels,num_classes=10)
val_x = vl_features
val_y = vl_labels

ts_sub_dirs= ['fold3']
ts_features,ts_labels = extract_features(parent_dir,ts_sub_dirs)
#ts_labels = one_hot_encode(ts_labels)
ts_labels = to_categorical(ts_labels,num_classes=10)
test_x = ts_features
test_y = ts_labels

# data dimension parameters
frames = 41
bands = 60
num_channels = 2
num_labels = test_y.shape[1]

# start by creating a linear stack of layers
model = Sequential()

# will use filters of size 2x2
f_size = 2

# first layer applies 32 convolution filters
# input: 60x41 data frames with 2 channels => (60,41,2) tensors
model.add(Convolution2D(32, f_size, f_size, border_mode='same', input_shape=(bands, frames, num_channels)))
model.add(Activation('relu'))
model.add(Convolution2D(32, f_size, f_size))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.15))

# next layer applies 64 convolution filters
model.add(Convolution2D(64, f_size, f_size, border_mode='same'))
model.add(Activation('relu'))
model.add(Convolution2D(64, f_size, f_size))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.2))

# flatten output into a single dimension
# Keras will do the shape inference automatically
model.add(Flatten())

# then a fully connected NN layer
model.add(Dense(256))
model.add(Activation('relu'))
model.add(Dropout(0.5))

# finally, an output layer with one node per class
model.add(Dense(num_labels))
model.add(Activation('softmax'))

# use the Adam optimiser
adam = Adam(lr=0.001, beta_1=0.9, beta_2=0.999, epsilon=1e-08, decay=0.0)

# now compile the model, Keras will take care of the Tensorflow boilerplate
model.compile(loss='categorical_crossentropy', metrics=['accuracy'], optimizer=adam)

print(train_x.shape)
print(train_y.shape)
print(type(train_x.shape))
print(type(train_y.shape))
print(train_x)
print(train_y)
# for quicker training, just using one epoch, you can experiment with more
model.fit(train_x, train_y, validation_data=(val_x, val_y), batch_size=32, nb_epoch=3)

# finally, evaluate the model using the withheld test dataset

# determine the ROC AUC score
y_prob = model.predict_proba(train_x, verbose=0)
print(y_prob)
y_prob = model.predict_proba(test_x, verbose=0)
print(y_prob)
y_pred = np_utils.probas_to_classes(y_prob)
#y_true = np.argmax(test_y, 1)
roc = metrics.roc_auc_score(test_y, y_prob)
print "ROC:", round(roc,3)

# determine the classification accuracy
score, accuracy = model.evaluate(test_x, test_y, batch_size=32)
print("\nAccuracy = {:.2f}".format(accuracy))
