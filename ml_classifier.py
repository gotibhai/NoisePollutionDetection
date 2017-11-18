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

# def load_sound_files(file_paths):
#     raw_sounds = []
#     for fp in file_paths:
#         X,sr = librosa.load(fp)
#         raw_sounds.append(X)
#     return raw_sounds

# def plot_waves(sound_names,raw_sounds):
#     i = 1
#     fig = plt.figure(figsize=(10,12), dpi=100)
#     for n,f in zip(sound_names,raw_sounds):
#         plt.subplot(10,1,i)
#         librosa.display.waveplot(np.array(f),sr=22050)
#         plt.title(n.title())
#         i += 1
#     plt.suptitle("Figure 1: Waveplot",x=0.5, y=0.01,fontsize=11)
#     plt.show()
    
# def plot_specgram(sound_names,raw_sounds):
#     i = 1
#     fig = plt.figure(figsize=(10,12), dpi = 100)
#     for n,f in zip(sound_names,raw_sounds):
#         plt.subplot(10,1,i)
#         specgram(np.array(f), Fs=22050)
#         plt.title(n.title())
#         i += 1
#     plt.suptitle("Figure 2: Spectrogram",x=0.5, y=0.01,fontsize=11)
#     plt.show()

# def plot_log_power_specgram(sound_names,raw_sounds):
#     i = 1
#     fig = plt.figure(figsize=(10,12), dpi = 100)
#     for n,f in zip(sound_names,raw_sounds):
#         plt.subplot(10,1,i)
#         D = librosa.logamplitude(np.abs(librosa.stft(f))**2, ref_power=np.max)
#         librosa.display.specshow(D,x_axis='time' ,y_axis='log')
#         plt.title(n.title())
#         i += 1
#     plt.suptitle("Figure 3: Log power spectrogram",x=0.5, y=0.01,fontsize=11)
#     plt.show()


# file_paths = ['SoundData/pushkin/output.wav' , 'SoundData/someguy/test.wav']
# sound_names = ['pushkin', 'some_guy']

# raw_sounds = load_sound_files(file_paths)

# plot_waves(sound_names,raw_sounds)
# plot_specgram(sound_names,raw_sounds)
# plot_log_power_specgram(sound_names,raw_sounds)


# def extract_feature(file_name):
#     X, sample_rate = librosa.load(file_name)
#     stft = np.abs(librosa.stft(X))
#     mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T,axis=0)
#     chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T,axis=0)
#     mel = np.mean(librosa.feature.melspectrogram(X, sr=sample_rate).T,axis=0)
#     contrast = np.mean(librosa.feature.spectral_contrast(S=stft, sr=sample_rate).T,axis=0)
#     tonnetz = np.mean(librosa.feature.tonnetz(y=librosa.effects.harmonic(X),
#     sr=sample_rate).T,axis=0)
#     return mfccs,chroma,mel,contrast,tonnetz

# def parse_audio_files(parent_dir,sub_dirs,file_ext="*.wav"):
#     features, labels = np.empty((0,193)), np.empty(0)
#     for label, sub_dir in enumerate(sub_dirs):
#         for fn in glob.glob(os.path.join(parent_dir, sub_dir, file_ext)):
#             try:
#               mfccs, chroma, mel, contrast,tonnetz = extract_feature(fn)
#             except Exception as e:
#               print "Error encountered while parsing file: ", fn
#               continue
#             ext_features = np.hstack([mfccs,chroma,mel,contrast,tonnetz])
#             features = np.vstack([features,ext_features])
#             labels = np.append(labels, fn.split('/')[2].split('-')[1])
#     return np.array(features), np.array(labels, dtype = np.int)

# def one_hot_encode(labels):
#     n_labels = len(labels)
#     n_unique_labels = len(np.unique(labels))
#     one_hot_encode = np.zeros((n_labels,n_unique_labels))
#     one_hot_encode[np.arange(n_labels), labels] = 1
#     return one_hot_encode

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
    
parent_dir = 'SOUND'
tr_sub_dirs = ["fold1test","fold2test"]
tr_features,tr_labels = extract_features(parent_dir,tr_sub_dirs)
tr_labels = one_hot_encode(tr_labels)

ts_sub_dirs= ['fold3test']
ts_features,ts_labels = extract_features(parent_dir,ts_sub_dirs)
ts_labels = one_hot_encode(ts_labels)


def weight_variable(shape):
    initial = tf.truncated_normal(shape, stddev = 0.1)
    return tf.Variable(initial)

def bias_variable(shape):
    initial = tf.constant(1.0, shape = shape)
    return tf.Variable(initial)

def conv2d(x, W):
    return tf.nn.conv2d(x,W,strides=[1,2,2,1], padding='SAME')

def apply_convolution(x,kernel_size,num_channels,depth):
    weights = weight_variable([kernel_size, kernel_size, num_channels, depth])
    biases = bias_variable([depth])
    return tf.nn.relu(tf.add(conv2d(x, weights),biases))

def apply_max_pool(x,kernel_size,stride_size):
    return tf.nn.max_pool(x, ksize=[1, kernel_size, kernel_size, 1], 
                          strides=[1, stride_size, stride_size, 1], padding='SAME')

frames = 41
bands = 60

feature_size = 2460 #60x41
num_labels = 10
num_channels = 2

batch_size = 50
kernel_size = 30
depth = 20
num_hidden = 200

learning_rate = 0.01
total_iterations = 2000

X = tf.placeholder(tf.float32, shape=[None,bands,frames,num_channels])
Y = tf.placeholder(tf.float32, shape=[None,num_labels])

cov = apply_convolution(X,kernel_size,num_channels,depth)

shape = cov.get_shape().as_list()
cov_flat = tf.reshape(cov, [-1, shape[1] * shape[2] * shape[3]])

f_weights = weight_variable([shape[1] * shape[2] * depth, num_hidden])
f_biases = bias_variable([num_hidden])
f = tf.nn.sigmoid(tf.add(tf.matmul(cov_flat, f_weights),f_biases))

out_weights = weight_variable([num_hidden, num_labels])
out_biases = bias_variable([num_labels])
y_ = tf.nn.softmax(tf.matmul(f, out_weights) + out_biases)

loss = -tf.reduce_sum(Y * tf.log(y_))
optimizer = tf.train.AdamOptimizer(learning_rate=learning_rate).minimize(loss)
correct_prediction = tf.equal(tf.argmax(y_,1), tf.argmax(Y,1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

cost_history = np.empty(shape=[1],dtype=float)
with tf.Session() as session:
    tf.initialize_all_variables().run()

    for itr in range(total_iterations):    
        offset = (itr * batch_size) % (tr_labels.shape[0] - batch_size)
        batch_x = tr_features[offset:(offset + batch_size), :, :, :]
        batch_y = tr_labels[offset:(offset + batch_size), :]
        
        _, c = session.run([optimizer, loss],feed_dict={X: batch_x, Y : batch_y})
        cost_history = np.append(cost_history,c)
    
    print('Test accuracy: ',round(session.run(accuracy, feed_dict={X: ts_features, Y: ts_labels}) , 3))
# training_epochs = 100
# print("tr_features shape : ", tr_features.shape)
# n_dim = tr_features.shape[1]
# n_classes = 10
# n_hidden_units_one = 500
# n_hidden_units_two = 500
# sd = 1 / np.sqrt(n_dim)
# learning_rate = 0.001

# X = tf.placeholder(tf.float32,[None,n_dim])
# Y = tf.placeholder(tf.float32,[None,n_classes])

# W_1 = tf.Variable(tf.random_normal([n_dim,n_hidden_units_one], mean = 0, stddev=sd))
# b_1 = tf.Variable(tf.random_normal([n_hidden_units_one], mean = 0, stddev=sd))
# h_1 = tf.nn.tanh(tf.matmul(X,W_1) + b_1)

# W_2 = tf.Variable(tf.random_normal([n_hidden_units_one,n_hidden_units_two], 
# mean = 0, stddev=sd))
# b_2 = tf.Variable(tf.random_normal([n_hidden_units_two], mean = 0, stddev=sd))
# h_2 = tf.nn.sigmoid(tf.matmul(h_1,W_2) + b_2)

# W = tf.Variable(tf.random_normal([n_hidden_units_two,n_classes], mean = 0, stddev=sd))
# b = tf.Variable(tf.random_normal([n_classes], mean = 0, stddev=sd))
# y_ = tf.nn.softmax(tf.matmul(h_2,W) + b)

# init = tf.global_variables_initializer()

# cost_function = -tf.reduce_sum(Y * tf.log(y_))
# optimizer = tf.train.AdamOptimizer(learning_rate).minimize(cost_function)

# correct_prediction = tf.equal(tf.argmax(y_,1), tf.argmax(Y,1))
# accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))


# cost_history = np.empty(shape=[1],dtype=float)
# y_true, y_pred = None, None
# with tf.Session() as sess:
#     sess.run(init)
#     for epoch in range(training_epochs):            
#         _,cost = sess.run([optimizer,cost_function],feed_dict={X:tr_features,Y:tr_labels})
#         cost_history = np.append(cost_history,cost)
    
#     y_pred = sess.run(tf.argmax(y_,1),feed_dict={X: ts_features})
#     y_true = sess.run(tf.argmax(ts_labels,1))
#     print("Test accuracy: ",round(sess.run(accuracy, 
#         feed_dict={X: ts_features,Y: ts_labels}),3))

# fig = plt.figure(figsize=(10,8))
# cost_history = [value for value in cost_history if not math.isnan(value)]
# plt.plot(cost_history)
# plt.axis([0,training_epochs,0,np.max(cost_history)])
# plt.show()

# p,r,f,s = precision_recall_fscore_support(y_true, y_pred, average="micro")
# print "F-Score:", round(f,3)










