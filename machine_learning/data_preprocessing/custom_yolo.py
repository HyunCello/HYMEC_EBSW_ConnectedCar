from glob import glob
from sklearn.model_selection import train_test_split
import yaml

# data_location structure
# | /data_location
#   | images/
#   | labels/

data_location=''
yaml_location=''


# load images
img_list = glob(data_location+'/images/*.jpg')

print('total_img : ',len(img_list))


# dataset split
train_img_list, val_img_list = train_test_split(img_list, test_size=0.2, random_state=2000)

print('train_set : ',len(train_img_list), 'validation_set : ',len(val_img_list))



# create train, validation dataset lists in textfile
with open(data_location+'/train.txt', 'w') as f:
  f.write('\n'.join(train_img_list) + '\n')

with open(data_location+'/val.txt', 'w') as f:
  f.write('\n'.join(val_img_list) + '\n')


# modify data.yaml
with open(yaml_location+'/data.yaml', 'r') as f:
    data = yaml.load(f)

print('before : ',data)

data['train'] = data_location+'/train.txt'
data['val'] = data_location+'/val.txt'

with open(yaml_location+'/data.yaml', 'w') as f:
  yaml.dump(data, f)

print('after : ',data)