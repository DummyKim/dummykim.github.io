document.addEventListener('DOMContentLoaded', function() {
  // Array to store the picked numbers
  var pickedNumbers = [];

  window.pickRandomNumber = function() {
      // Get the input value
      var input = document.getElementById('numberInput').value;
      
      // Convert the input value to a number
      var maxNumber = Number(input);
      
      // Check if the input is a valid number and greater than 0
      if (isNaN(maxNumber) || maxNumber <= 0) {
          document.getElementById('random-result').innerText = '0보다 큰 숫자를 입력해주세요.';
          return;
      }
      
      // Pick a random number between 1 and maxNumber
      var randomNumber = Math.floor(Math.random() * maxNumber) + 1;
      
      // Display the result
      document.getElementById('random-result').innerText = randomNumber + '번!';
      
      // Add the random number to the pickedNumbers array
      pickedNumbers.push(randomNumber);
      
      // Display the list of picked numbers
      updateNumberList();
  };

  window.clearList = function() {
      // Clear the pickedNumbers array
      pickedNumbers = [];
      
      // Clear the displayed list
      updateNumberList();
  };

  function updateNumberList() {
      var numberList = document.getElementById('numberList');
      numberList.innerHTML = ''; // Clear the existing list
      pickedNumbers.forEach(function(number) {
          var listItem = document.createElement('li');
          listItem.textContent = number;
          numberList.appendChild(listItem);
      });
  }
});
