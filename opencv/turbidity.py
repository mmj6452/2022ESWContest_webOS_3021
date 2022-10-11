import cv2 as cv

lowerBound = (40, 40, 40)
upperBound = (80, 200, 255)

# High turbidity
src = cv.imread("opencv/img/high.jpg")
src_hsv = cv.cvtColor(src, cv.COLOR_BGR2HSV)
dst = cv.inRange(src, lowerBound, upperBound)
cv.imshow("High", dst)
height, width = dst.shape[:2]
print("High", cv.countNonZero(dst) / (height * width))

# Low turbidity
src = cv.imread("opencv/img/low.jpg")
src_hsv = cv.cvtColor(src, cv.COLOR_BGR2HSV)
dst = cv.inRange(src, lowerBound, upperBound)
cv.imshow("Low", dst)
height, width = dst.shape[:2]
print("Low", cv.countNonZero(dst) / (height * width))

cv.waitKey()
