import cv2 as cv

lowerBound = (30, 0, 0)
upperBound = (80, 255, 200)

# High turbidity
src = cv.imread("opencv/img/high.jpg")
if src is None:
    raise Exception("Could not load image")
src = cv.resize(src, (640, 480), interpolation=cv.INTER_CUBIC)
src_hsv = cv.cvtColor(src, cv.COLOR_BGR2HSV)
H_dst = cv.inRange(src_hsv, lowerBound, upperBound)
height, width = H_dst.shape[:2]
pixel_cnt = (height * width)
# divide the image BGR into 3 parts
b, g, r = cv.split(src)
# multiply the image BGR by the mask
H_g = cv.bitwise_and(g, H_dst)
# sum the pixels of the image
H_g_sum = cv.sumElems(H_g)
# calculate the average
print("High = ", H_g_sum[0]/pixel_cnt)

# Low turbidity
src = cv.imread("opencv/img/low.jpg")
src = cv.resize(src, (640, 480), interpolation=cv.INTER_CUBIC)
src_hsv = cv.cvtColor(src, cv.COLOR_BGR2HSV)
L_dst = cv.inRange(src_hsv, lowerBound, upperBound)
height, width = L_dst.shape[:2]
pixel_cnt = (height * width)
# divide the image BGR into 3 parts
b, g, r = cv.split(src)
# multiply the image BGR by the mask
L_g = cv.bitwise_and(g, L_dst)
# sum all pixels
L_g_sum = cv.sumElems(L_g)
# average pixels
print("Low =", L_g_sum[0] / pixel_cnt)

# stack the images
stack_dst = cv.hconcat([H_dst, L_dst])
stack_g = cv.hconcat([H_g, L_g])
image = cv.vconcat([stack_dst, stack_g])
cv.imshow("stack", image)

cv.waitKey()
