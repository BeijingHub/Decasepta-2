# Decasepta II – Full Modular Template
import pygame
import sys
import os

# === [INIT: Setup] ===
pygame.init()
WIDTH, HEIGHT = 1000, 600
win = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Decasepta II")
clock = pygame.time.Clock()
FPS = 60

# === [ENVIRONMENT_SETUP: Load Background/Environment Images] ===
# [MARKER: ENVIRONMENT_SETUP]
def load_environment():
    bg = pygame.image.load("assets/background.png").convert()
    bg = pygame.transform.scale(bg, (WIDTH, HEIGHT))
    return bg

background = load_environment()

# === [CHARACTER_SELECTOR: Emoji Characters] ===
# [MARKER: CHARACTER_SELECTOR]
EMOJI_CHARACTERS = [
    ("💀", "Skull"), ("🧑", "Human"), ("🌀", "Vortex"), ("🔥", "Fire"), ("🌪️", "Tornado"), ("👽", "Alien"),
    ("🤖", "Robot"), ("👻", "Ghost"), ("🐉", "Dragon"), ("🦊", "Fox"), ("🐢", "Turtle"), ("🐸", "Frog"),
    ("🐺", "Wolf"), ("🦁", "Lion"), ("🐧", "Penguin"), ("🦋", "Butterfly"), ("🐍", "Snake"), ("🦑", "Squid"),
    ("🧙", "Wizard"), ("🧛", "Vampire"), ("🧟", "Zombie"), ("🧞", "Genie"), ("🧜", "Mermaid"), ("🎃", "Pumpkin"),
    ("👾", "Pixel"), ("☠️", "Death"), ("🧠", "Brain")
]
PLAYER_EMOJI = "👻"  # Default
PLAYER_NAME = "Ghost"

CHASER_EMOJI = "🧟"  # Always the zombie

# === [MARKER: HOME_SCREEN_MANAGER] ===
def show_home_screen():
    global PLAYER_EMOJI, PLAYER_NAME, game_mode

    selected_index = 0
    difficulty_index = 1
    difficulty_modes = ["easy", "medium", "hard", "insane"]

    font = pygame.font.SysFont(None, 32)
    selecting = True

    while selecting:
        win.fill((240, 240, 255))
        title = font.render("💥 Decasepta II 💥", True, (0, 0, 0))
        win.blit(title, (WIDTH // 2 - 100, 40))

        # Emoji character selection
        for i, (emoji, name) in enumerate(EMOJI_CHARACTERS):
            color = (0, 0, 0) if i != selected_index else (200, 0, 0)
            text = font.render(f"{emoji} {name}", True, color)
            win.blit(text, (100, 100 + i * 25))

        # Difficulty selection
        d_text = font.render(f"Difficulty: {difficulty_modes[difficulty_index]}", True, (0, 100, 0))
        win.blit(d_text, (WIDTH - 300, 100))

        info = font.render("UP/DOWN = Choose Character | LEFT/RIGHT = Difficulty | ENTER = Start", True, (50, 50, 50))
        win.blit(info, (50, HEIGHT - 40))

        pygame.display.update()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP:
                    selected_index = (selected_index - 1) % len(EMOJI_CHARACTERS)
                elif event.key == pygame.K_DOWN:
                    selected_index = (selected_index + 1) % len(EMOJI_CHARACTERS)
                elif event.key == pygame.K_LEFT:
                    difficulty_index = (difficulty_index - 1) % len(difficulty_modes)
                elif event.key == pygame.K_RIGHT:
                    difficulty_index = (difficulty_index + 1) % len(difficulty_modes)
                elif event.key == pygame.K_RETURN:
                    PLAYER_EMOJI, PLAYER_NAME = EMOJI_CHARACTERS[selected_index]
                    game_mode = difficulty_modes[difficulty_index]
                    selecting = False

# === [INIT: Game Variables] ===
player_x = 0.0
player_y = 10.0
player_vx = 0.0
player_vy = 0.0
player_ax = 0.0
gravity = 0.5
min_y = 4.0
chaser_x = -500.0
chaser_speed = 1.0
score = 0
start_ticks = pygame.time.get_ticks()
font = pygame.font.SysFont(None, 24)
slope_m = 0.0
slope_start_x = 0.0
base_height = 10.0
game_mode = "medium"

# === [FUNCTION: Set Difficulty] ===
def set_difficulty(mode):
    global chaser_speed
    if mode == "easy": chaser_speed = 0.5
    elif mode == "medium": chaser_speed = 1.0
    elif mode == "hard": chaser_speed = 3.0
    elif mode == "insane": chaser_speed = 7.0

# === [FUNCTION: Terrain Height] ===
def get_terrain_y(x):
    return slope_m * (x - slope_start_x) + base_height

# === [HOME SCREEN INIT] ===
show_home_screen()
set_difficulty(game_mode)

# === MAIN LOOP ===
run = True
while run:
    dt = clock.tick(FPS) / 1000
    win.blit(background, (0, 0))  # [MARKER: BACKGROUND_RENDER]

    # === [INPUT] ===
    keys = pygame.key.get_pressed()
    if keys[pygame.K_SPACE]:
        player_ax = 0.33
    else:
        player_ax = 0.0

    # === [PHYSICS] ===
    player_vx += player_ax * dt
    player_x += player_vx * dt

    if player_y > min_y:
        player_vy -= gravity * dt
    else:
        player_vy = 0
    player_y += player_vy * dt

    # === [CHASER AI] ===
    chaser_x += chaser_speed * dt

    # === [TOUCH DETECTION] ===
    if abs(chaser_x - player_x) < 1.0:
        print("Chaser caught you! Score halved.")
        score = max(1, score // 2)
        chaser_x -= 500

    # === [SCORING] ===
    score = int(player_x)

    # === [HUD] ===
    elapsed_time = (pygame.time.get_ticks() - start_ticks) // 1000
    hud = font.render(f"{PLAYER_EMOJI} {PLAYER_NAME} | Score: {score} | Time: {elapsed_time}s", True, (0, 0, 0))
    win.blit(hud, (10, 10))

    # === [RENDER: Characters] ===
    player_pos = (WIDTH//2, HEIGHT - int(player_y * 10))
    chaser_screen_x = WIDTH//2 - int((player_x - chaser_x) * 10)
    chaser_pos = (chaser_screen_x, HEIGHT - int(player_y * 10))

    font_big = pygame.font.SysFont(None, 36)
    win.blit(font_big.render(PLAYER_EMOJI, True, (0, 0, 0)), player_pos)
    win.blit(font_big.render(CHASER_EMOJI, True, (0, 0, 0)), chaser_pos)

    # === [EVENTS] ===
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False

    pygame.display.update()

# === [END] ===
pygame.quit()
print("\nGame Over.")
print(f"Final Score: {score}")
print(f"Time Played: {elapsed_time} seconds")
