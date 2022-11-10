import cv2 as cv
import numpy as np

lowerBound = (30, 0, 0)
upperBound = (80, 255, 200)
# High turbidity
src = cv.imread("C:/Users/64527/Documents/GitHub/2022ESWContest_webOS_3021/opencv/img/high.jpg")
src = cv.resize(src, (640, 480), interpolation= cv.INTER_CUBIC)
src_hsv = cv.cvtColor(src, cv.COLOR_BGR2HSV)
H_dst = cv.inRange(src_hsv, lowerBound, upperBound)
height, width = H_dst.shape[:2]
pixel_cnt = (height * width)
#divide the image BGR into 3 parts
b, g, r = cv.split(src)
#multiply the image BGR by the mask
H_g = cv.bitwise_and(g, H_dst)
#sum the pixels of the image
sum = np.sum(H_g)
print("High sum =",sum)
#calculate the average
print("High", sum/pixel_cnt)

# Low turbidity
src = cv.imread("C:/Users/64527/Downloads/Low.jpg")
src = cv.resize(src, (640, 480), interpolation= cv.INTER_CUBIC)
src_hsv = cv.cvtColor(src, cv.COLOR_BGR2HSV)
L_dst = cv.inRange(src_hsv, lowerBound, upperBound)
height, width = L_dst.shape[:2]
pixel_cnt = (height * width)
#divide the image BGR into 3 parts
b, g, r = cv.split(src)
#multiply the image BGR by the mask
L_g = cv.bitwise_and(g, L_dst)
#sum all pixels
sum = np.sum(L_g)
#average pixels
print("Low sum =",sum)
print("Low", sum / pixel_cnt)

#stack the images
stack_dst = np.hstack((H_dst, L_dst))
stack_g = np.hstack((H_g, L_g))
image = np.vstack((stack_dst, stack_g))
cv.imshow("stack", image)


cv.waitKey()
