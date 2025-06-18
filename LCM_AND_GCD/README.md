# LCM & GCD Calculator

A simple web application to calculate the Least Common Multiple (LCM) and Greatest Common Divisor (GCD) of two positive integers.

## Features

- Responsive UI (HTML, CSS, JS)
- RESTful API (Python Flask)
- Input validation and error handling
- CORS enabled for local development

## Setup Instructions

### 1. Clone or Download

Place all files in a folder (e.g., `m:\LCM AND GCD`).

### 2. Install Python Dependencies

Open a terminal in the project folder and run:

```bash
pip install flask flask-cors
```

### 3. Start the Flask Server

```bash
python app.py
```

The server will run at `http://127.0.0.1:5000/`.

### 4. Open the Front-End

Open `index.html` in your browser (double-click or use VS Code Live Server extension).

### 5. Usage

- Enter two positive integers.
- Click "Calculate GCD" or "Calculate LCM".
- The result will be displayed below the buttons.

## Notes

- Ensure the Flask server is running before using the calculator.
- For debugging, use VS Code's Python and JavaScript debugging features.

## License

MIT License
