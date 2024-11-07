#!/usr/bin/env python
import matplotlib.pyplot as plt

# symplectic計算順序の確認
x = 0
v = 1.0
m = 1.0
k = 1.0
dt = 0.1


def onestep(dt):
    global x, v, k, m
    x += v * dt / 2
    F = -k * x
    a = F / m
    v += a * dt
    x += v * dt / 2


def onestep_euler(dt):
    global x, v, k, m
    F = -k * x
    a = F / m
    x += v * dt
    v += a * dt


xx = []
vv = []
for i in range(100):
    xx.append(x)
    vv.append(v)
    onestep(dt)


plt.plot(xx, vv)


xx = []
vv = []
for i in range(100):
    xx.append(x)
    vv.append(v)
    onestep_euler(dt)


plt.plot(xx, vv)
plt.show()
