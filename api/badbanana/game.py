from badbanana.question.questionmaker import QuestionMaker
from badbanana.player import Player 

class Game():
    def __init__(self, player : Player):
        self.player = player
        self.question_maker = QuestionMaker()
        self._valid_operations = {'addition','subtraction','multiplication','division'}
    
    def get_valid_operations(self):
        return self._valid_operations

    def set_question_type(self, operation : str):
        assert operation.lower() in self._valid_operations, f"Invalid operation: {operation}"
        self.question_maker.set_question_class(operation)

    def set_question_bounds(self, _lower : int, _upper : int):
        assert _upper >= _lower, "Upper bound must be greater than lower bound."
        self.question_maker.lowerbound, self.question_maker.upperbound = _lower, _upper

    def get_random_question(self):
        return self.question_maker.generate_random_question()


