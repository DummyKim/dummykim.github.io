let selectedCells = [];
let fixedSeats = [];

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

    // 고정된 자리를 제외한 나머지 학생 리스트 만들기
    const freeSeats = students.filter((student, index) => !fixedSeats.some(seat => seat.student === student));
    shuffle(freeSeats);

    let freeSeatIndex = 0;

    const rows = Math.ceil(studentCount / columns);
  
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
  
    selectedCells = [];
  
    if (layout === 'single') {
        for (let row = 0; row < rows; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < columns; col++) {
                const seatIndex = row * columns + col;
                const td = document.createElement('td');
                td.style.position = 'relative';
                td.style.border = '1px solid black';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.width = '120px';  // 가로 크기
                td.style.height = '90px';  // 세로 크기
                td.style.fontSize = '20px';  // 폰트 크기
                
                if (fixedSeats.some(seat => seat.index === seatIndex)) {
                    const fixedSeat = fixedSeats.find(seat => seat.index === seatIndex);
                    td.innerHTML = `
                        <div class="seat-checkbox-container">
                            <input type="checkbox" class="seat-fixed-checkbox" checked>
                        </div>
                        <label>
                            <input type="checkbox" class="seat-checkbox"> 
                            ${fixedSeat.student}
                        </label>`;
                } else {
                    td.innerHTML = `
                        <div class="seat-checkbox-container">
                            <input type="checkbox" class="seat-fixed-checkbox">
                        </div>
                        <label>
                            <input type="checkbox" class="seat-checkbox"> 
                            ${freeSeats[freeSeatIndex++] || ''}
                        </label>`;
                }

                td.querySelector('.seat-fixed-checkbox').addEventListener('click', (event) => handleFixedCheckboxClick(event, td, seatIndex));
                td.querySelector('.seat-checkbox').addEventListener('click', (event) => handleCheckboxClick(event, td));
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
                    td.style.position = 'relative';
                    td.style.border = '1px solid black';
                    td.style.padding = '10px';
                    td.style.textAlign = 'center';
                    td.style.width = '120px';  // 가로 크기
                    td.style.height = '90px';  // 세로 크기
                    td.style.fontSize = '20px';  // 폰트 크기
                    
                    if (fixedSeats.some(seat => seat.index === seatIndex)) {
                        const fixedSeat = fixedSeats.find(seat => seat.index === seatIndex);
                        td.innerHTML = `
                            <div class="seat-checkbox-container">
                                <input type="checkbox" class="seat-fixed-checkbox" checked>
                            </div>
                            <label>
                                <input type="checkbox" class="seat-checkbox"> 
                                ${fixedSeat.student}
                            </label>`;
                    } else {
                        td.innerHTML = `
                            <div class="seat-checkbox-container">
                                <input type="checkbox" class="seat-fixed-checkbox">
                            </div>
                            <label>
                                <input type="checkbox" class="seat-checkbox"> 
                                ${freeSeats[freeSeatIndex++] || ''}
                            </label>`;
                    }

                    td.querySelector('.seat-fixed-checkbox').addEventListener('click', (event) => handleFixedCheckboxClick(event, td, seatIndex));
                    td.querySelector('.seat-checkbox').addEventListener('click', (event) => handleCheckboxClick(event, td));
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
                td.style.position = 'relative';
                td.style.border = '1px solid black';
                td.style.padding = '10px';
                td.style.textAlign = 'center';
                td.style.width = '120px';  // 가로 크기
                td.style.height = '90px';  // 세로 크기
                td.style.fontSize = '20px';  // 폰트 크기
                
                if (fixedSeats.some(seat => seat.index === seatIndex)) {
                    const fixedSeat = fixedSeats.find(seat => seat.index === seatIndex);
                    td.innerHTML = `
                        <div class="seat-checkbox-container">
                            <input type="checkbox" class="seat-fixed-checkbox" checked>
                        </div>
                        <label>
                            <input type="checkbox" class="seat-checkbox"> 
                            ${fixedSeat.student}
                        </label>`;
                } else {
                    td.innerHTML = `
                        <div class="seat-checkbox-container">
                            <input type="checkbox" class="seat-fixed-checkbox">
                        </div>
                        <label>
                            <input type="checkbox" class="seat-checkbox"> 
                            ${freeSeats[freeSeatIndex++] || ''}
                        </label>`;
                }

                td.querySelector('.seat-fixed-checkbox').addEventListener('click', (event) => handleFixedCheckboxClick(event, td, seatIndex));
                td.querySelector('.seat-checkbox').addEventListener('click', (event) => handleCheckboxClick(event, td));
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

    reassignEventListeners(); // Assign event listeners after generating seats
}

function handleCheckboxClick(event, td) {
    event.stopPropagation(); // 이벤트 전파를 막음
    const checkbox = event.target;

    if (checkbox.checked) {
        if (!selectedCells.includes(td)) {
            selectedCells.push(td);
        }
    } else {
        selectedCells = selectedCells.filter(cell => cell !== td);
    }

    console.log('Checkbox clicked:', checkbox.checked);
    console.log('Selected cells:', selectedCells);

    // '자리 바꾸기' 버튼 활성화/비활성화
    const swapButton = document.getElementById('seat-swapBtn');
    if (selectedCells.length === 2) {
        swapButton.disabled = false;
    } else {
        swapButton.disabled = true;
    }
}

function handleFixedCheckboxClick(event, td, seatIndex) {
    event.stopPropagation(); // 이벤트 전파를 막음
    const checkbox = event.target;

    if (checkbox.checked) {
        if (!fixedSeats.some(seat => seat.index === seatIndex)) {
            fixedSeats.push({ index: seatIndex, student: td.querySelector('label').textContent.trim() });
        }
    } else {
        fixedSeats = fixedSeats.filter(seat => seat.index !== seatIndex);
    }

    console.log('Fixed checkbox clicked:', checkbox.checked);
    console.log('Fixed seats:', fixedSeats);
}

function swapSelectedSeats() {
    if (selectedCells.length === 2) {
        console.log('Swapping seats:', selectedCells);
        swapCells(selectedCells[0], selectedCells[1]);

        // Checkboxes in the swapped cells should be unchecked and the selectedCells array should be cleared
        selectedCells.forEach(cell => {
            const checkbox = cell.querySelector('.seat-checkbox');
            checkbox.checked = false;
        });

        // Clear selectedCells array
        selectedCells = [];

        // Disable the swap button
        document.getElementById('seat-swapBtn').disabled = true;

        console.log('Selected cells after swap:', selectedCells);
        
        reassignEventListeners(); // Re-assign event listeners after swapping cells
    }
}

function handleCellClick(td) {
    // Do nothing, as we only want to handle the checkbox clicks
}

function swapCells(cell1, cell2) {
    const tempText = cell1.querySelector('label').innerHTML;
    cell1.querySelector('label').innerHTML = cell2.querySelector('label').innerHTML;
    cell2.querySelector('label').innerHTML = tempText;
    console.log('Swapped cells:', cell1, cell2);
}

// '자리 바꾸기' 버튼에 이벤트 리스너 추가
document.getElementById('seat-swapBtn').addEventListener('click', swapSelectedSeats);

// Function to assign event listeners to checkboxes
function reassignEventListeners() {
    document.querySelectorAll('.seat-checkbox').forEach(checkbox => {
        checkbox.removeEventListener('click', handleCheckboxClick); // Remove existing event listener
        checkbox.addEventListener('click', (event) => handleCheckboxClick(event, checkbox.closest('td'))); // Assign new event listener
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("seat-manualModal");
    const btn = document.getElementById("seat-manualBtn");
    const span = document.getElementsByClassName("seat-close-btn")[0];

    // 설명 보기 버튼을 클릭했을 때
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // 닫기 버튼을 클릭했을 때
    span.onclick = function() {
        modal.style.display = "none";
    }

    // 모달 외부를 클릭했을 때
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
