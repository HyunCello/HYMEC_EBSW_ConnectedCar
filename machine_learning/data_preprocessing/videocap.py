# -*- coding: utf-8 -*-

import cv2
 
# 영상의 의미지를 연속적으로 캡쳐할 수 있게 하는 class
vidcap = cv2.VideoCapture(0)
 
count = 0
 
time=int(input('time gap : '))


while(vidcap.isOpened()):
    ret, image = vidcap.read()
    
    if(int(vidcap.get(1)) % 100 == 0):
        print('Saved frame number : ' + str(int(vidcap.get(1))))
        cv2.imwrite("./images/frame%d.jpg" % count, image)
        print('Saved frame%d.jpg' % count)
        count += 1
        if cv2.waitKey(time) == ord('c'):
            print("chal kak")
            vidcap.release()
            break




