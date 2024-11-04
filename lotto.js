// 구입할 금액을 입력받아 구매 가능한 로또 개수를 계산하는 함수
function calculateLottoCount(amount) {
    const pricePerLotto = 1000; // 한 장에 천원
    return Math.floor(amount / pricePerLotto); // 구매 가능한 로또 개수 계산
}

// 로또 번호를 생성하는 함수
function generateLottoNumbers() {
    const numbers = Array.from({length: 45}, (_, i) => i + 1); // 1부터 45까지의 숫자 배열 생성
    const shuffled = numbers.sort(() => 0.5 - Math.random()); // 숫자 배열 랜덤으로 섞기
    return shuffled.slice(0, 6).sort((a, b) => a - b); // 앞에서 6개 숫자 선택하고 오름차순 정렬
}

// 금액 입력 폼 제출 시 실행되는 함수
function onSubmitAmountForm(event) {
    event.preventDefault(); // 폼 제출 기본 동작 막기
    const amountInput = document.getElementById('target');
    const amount = parseInt(amountInput.value);
    const lottoCount = calculateLottoCount(amount);
    
    const lottoNumbersElement = document.querySelector('#lottos ul');
    lottoNumbersElement.innerHTML = ''; // 기존 번호 목록 지우기
    
    for (let i = 0; i < lottoCount; i++) {
        const numbers = generateLottoNumbers();
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span style="font-size: 34px;">🎟️</span>${numbers.join(', ')}`;
        lottoNumbersElement.appendChild(listItem);
    }
    
    const lottoCountElement = document.querySelector('#lottos .body');
    lottoCountElement.textContent = `총 ${lottoCount}개를 구매하였습니다.`;
}

// 결과 확인하기 버튼 클릭 시 실행되는 함수
function onClickResultButton() {
    const winningNumbers = [];
    const bonusNumber = parseInt(document.querySelector('#bonus-num input').value);

    document.querySelectorAll('#winning-num input').forEach(input => {
        winningNumbers.push(parseInt(input.value));
    });

    // 당첨 번호와 보너스 번호가 모두 입력되었는지 확인
    if (winningNumbers.length !== 6 || isNaN(bonusNumber)) {
        alert('당첨 번호 6개와 보너스 번호를 모두 입력해주세요.');
        return;
    }

    const purchasedLottos = document.querySelectorAll('#lottos li');
    const matchCounts = {3: 0, 4: 0, 5: 0, 5.5: 0, 6: 0};

    purchasedLottos.forEach(lotto => {
        const numbers = lotto.textContent.match(/\d+/g).map(Number);
        const matchCount = numbers.filter(num => winningNumbers.includes(num)).length;
        const hasBonusNumber = numbers.includes(bonusNumber);

        if (matchCount === 3) matchCounts[3]++;
        else if (matchCount === 4) matchCounts[4]++;
        else if (matchCount === 5 && hasBonusNumber) matchCounts[5.5]++;
        else if (matchCount === 5) matchCounts[5]++;
        else if (matchCount === 6) matchCounts[6]++;
    });

    document.getElementById('match-3').textContent = matchCounts[3] + '개';
    document.getElementById('match-4').textContent = matchCounts[4] + '개';
    document.getElementById('match-5').textContent = matchCounts[5] + '개';
    document.getElementById('match-5-bonus').textContent = matchCounts[5.5] + '개';
    document.getElementById('match-6').textContent = matchCounts[6] + '개';

    const totalPrize = matchCounts[3] * 5000 + matchCounts[4] * 50000 + matchCounts[5] * 1500000 + matchCounts[5.5] * 30000000 + matchCounts[6] * 2000000000;
    const totalSpent = purchasedLottos.length * 1000;
    const earningRate = (totalPrize / totalSpent * 100).toFixed(2);
    document.getElementById('total-rate').textContent = `당신의 총 수익률은 ${earningRate}%입니다.`;

    modal.style.display = "block";
}

// 다시 시작하기 버튼 클릭 시 실행되는 함수
function onClickRestartButton() {
    modal.style.display = "none";
    document.getElementById('amount-form').reset();
    document.querySelector('#lottos ul').innerHTML = '';
    document.querySelector('#lottos .body').textContent = '';
    document.getElementById('winning-num').reset();
    document.getElementById('bonus-num').reset();
}

// 모달 관련 요소 가져오기
const modal = document.getElementById("result-modal");
const closeButton = document.getElementsByClassName("close")[0];

// 금액 입력 폼 이벤트 리스너 등록
const amountForm = document.getElementById('amount-form');
amountForm.addEventListener('submit', onSubmitAmountForm);

// 결과 확인하기 버튼 이벤트 리스너 등록
const resultButton = document.querySelector('#result-button button');
resultButton.addEventListener('click', onClickResultButton);

// 다시 시작하기 버튼 이벤트 리스너 등록
const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', onClickRestartButton);

// 모달 닫기 버튼 클릭 시 모달 닫기
closeButton.addEventListener('click', () => {
    modal.style.display = "none";
});

// 모달 외부 클릭 시 모달 닫기
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});