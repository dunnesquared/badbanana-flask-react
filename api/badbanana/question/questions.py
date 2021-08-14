from typing import Any

class IntegerQuestion():
    def __init__(self, operand1 : int = 0, operand2 : int = 1, operator : str = None):
        self.operand1 = operand1
        self.operand2 = operand2
        self.operator = operator

        # eval can be very dangerous. Do some checking before executing it.
        if not isinstance(operand1, int) or not isinstance(operand2, int):
            raise ValueError('Invalid operand.') 
        if operator not in {'+', '-', '/', '//', '*'}:
            raise ValueError('Invalid operator.') 

        self.answer = eval(f"{operand1} {operator} {operand2}")
    
    def check_answer(self, submitted_answer : int) -> bool:
        return submitted_answer == self.answer
    
    def get_right_answer(self) -> Any:
        return self.answer

    def __str__(self):
        return f"{self.operand1} {self.operator} {self.operand2}"

    def __repr__(self):
        return f"{self.operand1} {self.operator} {self.operand2}"


class MultiplicationQuestion(IntegerQuestion):
    def __init__(self, operand1 : int, operand2 : int):
        super().__init__(operand1, operand2, '*')


class AdditionQuestion(IntegerQuestion):
    def __init__(self, operand1 : int, operand2 : int):
        super().__init__(operand1, operand2, '+')


class SubtractionQuestion(IntegerQuestion):
    def __init__(self, operand1 : int, operand2 : int):
        super().__init__(operand1, operand2, '-')


class DivisionQuestion(IntegerQuestion):
    def __init__(self, operand1 : int, operand2 : int):
        assert operand2 != 0, "Cannot divide by zero."
        # Use parent object
        super().__init__(operand1, operand2, '//')
        # Answer is a two-part response
        self.quotient = self.answer
        self.remainder = self.operand1 % self.operand2
    
    def check_answer(self, quotient : int, remainder : int) -> bool:
        return self.quotient == quotient and self.remainder == remainder
    
    def get_right_answer(self) -> Any:
        return {'quotient': self.quotient, 'remainder': self.remainder}