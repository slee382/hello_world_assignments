import turtle

# Set up the Turtle screen
wn = turtle.Screen()
wn.bgcolor("forestgreen")

# Create a Turtle object
tree = turtle.Turtle()
tree.hideturtle()  # Hide the turtle
tree.color("floralwhite")

# Function to draw a branch
def draw_branch(branch_length, t):
    if branch_length > 15:
        # Draw the main branch
        t.forward(branch_length)
        t.right(20)
        draw_branch(branch_length - 15, t)
        t.left(40)
        draw_branch(branch_length - 15, t)
        t.right(20)
        t.backward(branch_length)

# Set initial position and orientation
tree.left(90)
tree.up()
tree.backward(100)
tree.down()

# Draw the tree
draw_branch(100, tree)

# Close the Turtle graphics window when clicked
wn.exitonclick()