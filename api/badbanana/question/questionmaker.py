"""Factory class that makes and sets up IntegerQuestion child classes."""
import random

from badbanana.question.questions import IntegerQuestion, AdditionQuestion, SubtractionQuestion, \
    MultiplicationQuestion, DivisionQuestion

class QuestionMaker():
    """
    Class members:
        question_classes (dict): Dictionary to easily access desired IntegerQuestion class/
    Instance members:
        lowerbound (int): Smallest integer that can be randomly chosen as an operand, default 1.
        upperbound (int): Largest integer that can be randomly chosen as an operand, default 1000.
        QuestionClass: Points to IntegerQuestion child class, default MultiplicationQuestion.
    """

    question_classes = {
        'addition': AdditionQuestion,
        'subtraction': SubtractionQuestion,
        'multiplication': MultiplicationQuestion,
        'division': DivisionQuestion
    }

    def __init__(self):
        self.lowerbound = 1
        self.upperbound = 1000
        self.QuestionClass = MultiplicationQuestion
    
    def set_question_class(self, operation : str) -> None:
        """Sets type of arithmetic question this class should generate.

        Arguments:
            operation (str): The arithmetic operation that maps to an IntegerQuestion class.
        """
        # Ensure passed operation is valid before setting question type.
        if (question_class := QuestionMaker.question_classes.get(operation.lower())) is None:
            raise ValueError(f"Invalid operation type: {operation}")
        self.QuestionClass = question_class

    def generate_random_question(self) -> IntegerQuestion:
        """Creates random questions for a chosen arithmetic operation."""
        # Be careful.
        assert self.lowerbound < self.upperbound, "Lowerbound must be smaller than upperbound."
        
        # Set operands. 
        x = random.randint(self.lowerbound, self.upperbound)
        y = random.randint(self.lowerbound, self.upperbound)

        # Do not ask questions where the answer could be undefined.
        if self.QuestionClass is DivisionQuestion:
            while y == 0:
                y = random.randint(self.lowerbound, self.upperbound)

        return self.QuestionClass(x, y)


