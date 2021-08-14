"""Loads drawings and other text at start of game."""

import sys

# Load ASCII art before running the game. 
try:
    with open("./badbanana/cli/data/asciiart/happyface.txt") as f:
        happyface = f.read()
    with open("./badbanana/cli/data/asciiart/sadface.txt") as f:
        sadface = f.read()
    with open("./badbanana/cli/data/asciiart/badbanana.txt") as f:
        banana = f.read()
except OSError as err:
        print("OSError: {0}".format(err))
        happyface = '😁'        
        sadface = '😔'
        banana = '💩 🍌 💩'
        
# Load all text before running the game.
try:
    with open("./badbanana/cli/data/instructions.txt") as f:
        instructions = f.read()
except OSError as err:
    print("OSError: {0}".format(err))
    instructions = "Let's play!!"


