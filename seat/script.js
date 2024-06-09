function generateInputs() {
  const studentCount = document.getElementById('seat-student-count').value;
  const columns = document.getElementById('seat-columns').value;
  const studentNamesDiv = document.getElementById('seat-student-names');

  // 책상 수보다 학생 수가 많으면 경고 메시지 표시
  if (studentCount > columns * Math.ceil(studentCount / columns)) {
      alert('학생 수가 책상 수 보다 많습니다!');
      studentNamesDiv.innerHTML = ''; // 학생 이름 입력 창 생성되지 않음
      return;
  }

  studentNamesDiv.innerHTML = '';

  for (let i = 1; i <= studentCount; i++) {
      const inputDiv = document.createElement('div');
      inputDiv.className = 'seat-student-input';
      const input = document.createElement('input');
      input.type = 'text';
      input.value = i;
      inputDiv.appendChild(input);
      studentNamesDiv.appendChild(inputDiv);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function assignSeats() {
  const columns = parseInt(document.getElementById('seat-columns').value);
  const studentCount = parseInt(document.getElementById('seat-student-count').value);
  const layout = document.getElementById('seat-layout').value;
  const screenOption = document.querySelector('input[name="seat-screen"]:checked').value;
  const seatingDiv = document.getElementById('seat-seating');
  const overlay = document.getElementById('seat-overlay');
  const audio = document.getElementById('seat-countdownAudio');
  
  seatingDiv.innerHTML = ''; // 기존 내용 초기화
  overlay.style.display = 'none'; // 가림막 초기화

  const inputs = document.querySelectorAll('#seat-student-names input');
  const students = Array.from(inputs).map(input => input.value);
  shuffle(students);

  const rows = Math.ceil(studentCount / columns);

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';

  let selectedCells = [];

  if (layout === 'single') {
      for (let row = 0; row < rows; row++) {
          const tr = document.createElement('tr');
          for (let col = 0; col < columns; col++) {
              const seatIndex = row * columns + col;
              const td = document.createElement('td');
              td.style.border = '1px solid black';
              td.style.padding = '10px';
              td.style.textAlign = 'center';
              td.style.width = '120px';  // 가로 크기
              td.style.height = '90px';  // 세로 크기
              td.style.fontSize = '20px';  // 폰트 크기
              td.innerHTML = `<label><input type="checkbox" class="seat-checkbox" onclick="handleCheckboxClick(event, this)"> ${students[seatIndex] || ''}</label>`;
              td.onclick = () => handleCellClick(td, selectedCells);
              tr.appendChild(td);

              if (col < columns - 1) {
                  const spacerTd = document.createElement('td');
                  spacerTd.style.border = 'none';
                  spacerTd.style.width = '20px'; // 열 사이의 간격
                  tr.appendChild(spacerTd);
              }
          }
          table.appendChild(tr);
      }
  } else if (layout === 'double') {
      const pairs = Math.floor(columns / 2);
      const hasOddColumn = columns % 2 !== 0;

      for (let row = 0; row < rows; row++) {
          const tr = document.createElement('tr');
          for (let col = 0; col < pairs * 2; col += 2) {
              for (let subCol = 0; subCol < 2; subCol++) {
                  const seatIndex = row * columns + col + subCol;
                  const td = document.createElement('td');
                  td.style.border = '1px solid black';
                  td.style.padding = '10px';
                  td.style.textAlign = 'center';
                  td.style.width = '120px';  // 가로 크기
                  td.style.height = '90px';  // 세로 크기
                  td.style.fontSize = '20px';  // 폰트 크기
                  td.innerHTML = `<label><input type="checkbox" class="seat-checkbox" onclick="handleCheckboxClick(event, this)"> ${students[seatIndex] || ''}</label>`;
                  td.onclick = () => handleCellClick(td, selectedCells);
                  tr.appendChild(td);
              }

              if (col < (pairs - 1) * 2 || (hasOddColumn && col === pairs * 2 - 2)) {
                  const spacerTd = document.createElement('td');
                  spacerTd.style.border = 'none';
                  spacerTd.style.width = '40px'; // 두 짝지어진 열 사이의 간격
                  tr.appendChild(spacerTd);
              }
          }

          if (hasOddColumn) {
              const spacerTd = document.createElement('td');
              spacerTd.style.border = 'none';
              spacerTd.style.width = '40px'; // 두 짝지어진 열 사이의 간격
              tr.appendChild(spacerTd);

              const seatIndex = row * columns + (columns - 1);
              const td = document.createElement('td');
              td.style.border = '1px solid black';
              td.style.padding = '10px';
              td.style.textAlign = 'center';
              td.style.width = '120px';  // 가로 크기
              td.style.height = '90px';  // 세로 크기
              td.style.fontSize = '20px';  // 폰트 크기
              td.innerHTML = `<label><input type="checkbox" class="seat-checkbox" onclick="handleCheckboxClick(event, this)"> ${students[seatIndex] || ''}</label>`;
              td.onclick = () => handleCellClick(td, selectedCells);
              tr.appendChild(td);
          }

          table.appendChild(tr);
      }
  }

  seatingDiv.appendChild(table);

  if (screenOption === 'on') {
      overlay.style.display = 'flex'; // 가림막 표시
      audio.play(); // 오디오 재생
      setTimeout(() => {
          overlay.style.display = 'none'; // 가림막 숨기기
          audio.pause(); // 오디오 일시 정지
          audio.currentTime = 0; // 오디오 초기화
      }, 4000);
  }
}

function handleCheckboxClick(event, checkbox) {
  event.stopPropagation(); // 이벤트 전파를 막음
  const td = checkbox.closest('td');
  handleCellClick(td, []);
}

function handleCellClick(td, selectedCells) {
  const checkbox = td.querySelector('.seat-checkbox');
  checkbox.checked = !checkbox.checked;

  if (checkbox.checked) {
      selectedCells.push(td);
  } else {
      selectedCells = selectedCells.filter(cell => cell !== td);
  }

  if (selectedCells.length === 2) {
      swapCells(selectedCells[0], selectedCells[1]);
      selectedCells.forEach(cell => cell.querySelector('.seat-checkbox').checked = true);
      selectedCells.length = 0;
  }
}

function swapCells(cell1, cell2) {
  const tempText = cell1.querySelector('label').innerHTML;
  cell1.querySelector('label').innerHTML = cell2.querySelector('label').innerHTML;
  cell2.querySelector('label').innerHTML = tempText;
}
