"""Implements a command-line version of Bad Banana."""

import sys

from badbanana.cli import happyface, sadface, banana, instructions
from badbanana.player import Player 
from badbanana.game import Game

class CliGame(Game):
    def __init__(self, player : Player):
        super().__init__(player)
        
    def show_player_status(self):
        print(f"Current score: {self.player.score}")
        print(f"Lives left: {self.player.lives}")
    
    def _get_integer_input(self, label : str) -> int:
        while True:
            try:
                val = input(f"{label} = ")
                val = int(val)
            except ValueError:
                print(f"'{val}' is not a whole number. Try again :-).")
                continue
            break
        return val
    
    def play(self):
        """Starts Bad Banana game."""
        
        print("\nWELCOME TO BAD BANANA!\n")
        print("Press Ctrl-C to quit any time.\n")

        try:
            # Get name.   
            if not self.player.name:
                self.player.name = input("What's your name? ")
                print(f"\nHi {self.player.name}!\n")
                
            # Ask what kind of arithmetic the user would like to play today.
            while True:
                operation = input("What kind of arithmetic would you like to practice today:\n" + 
                            "Addition, subtraction, multiplication or division? ")
                if operation.lower() not in self.get_valid_operations():
                    print("I do not understand.")
                    continue
                break
            self.set_question_type(operation)

            # Define range of numbers. 
            print("\nFrom what to what numbers would you like to practice with?")
            while True:
                try:
                    min_int = int(input("From: "))
                    max_int = int(input("To: "))
                except ValueError:
                    print(f"Input values must be is not a whole number. Try again :-).")
                    continue
                if min_int >= max_int:
                    print("Your second number must be bigger than your first! Try again :-).")
                    continue
                break
            print("\nOk then :-)!\n")
            
            # Get question_maker ready to generate questions.
            self.set_question_bounds(min_int, max_int)

            # Display instructions and player's state.
            print(instructions)
            self.show_player_status()

            # Ask questions.
            while True:
                question = self.get_random_question()
                print(f"\nWhat is {question}?")
                
                # Division is its own special case.
                if operation != 'division':
                    ans = self._get_integer_input("Ans")
                    answer_correct = question.check_answer(ans)
                else:
                    quotient = self._get_integer_input("Quotient")
                    remainder = self._get_integer_input("Remainder")
                    answer_correct = question.check_answer(quotient, remainder)

                # Add point if answer is correct; lose a life if it's wrong.
                if answer_correct:
                    self.player.score += 1
                    print(happyface)
                    print("Awesome stuff!!!")
                else:
                    self.player.lives -= 1
                    if self.player.lives == 0:
                        print("\nAhhh!!! You lost all your lives! You're a BAD BANANA!!!\n")
                        print(banana, '\n')
                        print("Better luck next time :-P!\n")
                        sys.exit(0)
                    else:
                        print(sadface)
                        print("Ack!! Wrong answer!")
                        print(f"The right answer is: {question.get_right_answer()}")
                    
                self.show_player_status()
                
        except KeyboardInterrupt:
            print("\nBye!")
            sys.exit()

            

            


