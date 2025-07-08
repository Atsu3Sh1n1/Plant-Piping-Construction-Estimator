from vpython import cylinder, vector, rate, scene, color
import random
import math

# 画面設定
scene.title = "Quantum Spin Visualizer"
scene.width = 600
scene.height = 400

# つまようじ(シリンダー)を複数作る
toothpicks = []
for _ in range(15):
    tp = cylinder(
        pos=vector(random.uniform(-3,3), random.uniform(-3,3), random.uniform(-3,3)),
        axis=vector(0,2,0),
        radius=0.1,
        color=color.cyan
    )
    toothpicks.append(tp)

# アニメーションループ
while True:
    rate(60)  # 60fps
    for tp in toothpicks:
        # 3軸回転
        tp.rotate(angle=math.radians(random.uniform(5,15)), axis=vector(1,0,0))
        tp.rotate(angle=math.radians(random.uniform(5,15)), axis=vector(0,1,0))
        tp.rotate(angle=math.radians(random.uniform(5,15)), axis=vector(0,0,1))

        # 点滅（消えたり現れたり）
        if random.random() > 0.7:
            tp.visible = False
        else:
            tp.visible = True
