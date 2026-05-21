    let selectedNumbers = [];
    let currentFriend = 'قلب حبوبي - زينب';

    const gameHistory = [
      { player: 'You', numbers: [2, 5, 7, 9], score: 850, result: 'win' },
      { player: 'قلب حبوبي - زينب', numbers: [1, 4, 6, 8], score: 720, result: 'win' },
      ];

    const mySuggestions = [

    ];

    const friendSuggestions = [
      
    ];

    function initGame() {
      const grid = document.getElementById('numbersGrid');
      for (let i = 0; i <= 9; i++) {
        const btn = document.createElement('button');
        btn.className = 'number-btn';
        btn.textContent = i;
        btn.onclick = () => toggleNumber(i, btn);
        grid.appendChild(btn);
      }
      initializeFriends();
      updateHistoryView();
    }

    function initializeFriends() {
      const friendTabs = document.getElementById('friendTabs');
      Object.keys(friendSuggestions).forEach((friend, index) => {
        const btn = document.createElement('button');
        btn.className = 'friend-tab-btn' + (index === 0 ? ' active' : '');
        btn.textContent = friend;
        btn.onclick = () => selectFriend(friend);
        // friendTabs.appendChild(btn);
      });
      updateComparison();
    }

    function updateComparison1stTime() {
      const myCol = document.getElementById('mySuggestions');
      const friendCol = document.getElementById('friendSuggestions');
      const friendData = friendSuggestions[currentFriend];

      myCol.innerHTML = mySuggestions.map(suggestion => `
        <div class="suggestion-item">
          <div class="suggestion-numbers">
            ${suggestion.numbers.map(n => `<span class="suggestion-num">${n}</span>`).join('')}
          </div>
          <div class="suggestion-meta">
            <span class="suggestion-result badge ${
                suggestion.result === 'رقم الصديق مبهم'
                ? 'bg-dark'
                : suggestion.result === 'بدأ'
                ? 'bg-danger'
                : 'bg-success'
                }">⭐ ${suggestion.stars} | 🔵 ${suggestion.dots} = ${suggestion.result}</span>
          </div>
        </div>
      `).join('');

      friendCol.innerHTML = friendSuggestions.map(suggestion => `
        <div class="suggestion-item-friend">
          <div class="suggestion-numbers">
            ${suggestion.numbers.map(n => `<span class="suggestion-num">${n}</span>`).join('')}
          </div>
          <div class="suggestion-meta">
              <span class="suggestion-result badge ${
                suggestion.result === 'رقم الصديق مبهم'
                ? 'bg-dark'
                : suggestion.result === 'بدأ'
                ? 'bg-danger'
                : 'bg-secondary'
                }">:⭐ ${suggestion.stars} | 🔵 ${suggestion.dots} = ${suggestion.result} </span>
          </div>
        </div>
      `).join('');
    }

    function updateComparison() {
      const myCol = document.getElementById('friendSuggestions');
      const friendCol = document.getElementById('mySuggestions');
      const friendData = mySuggestions[currentFriend];

      myCol.innerHTML = friendSuggestions.map(suggestion => `
        <div class="suggestion-item-friend">
          <div class="suggestion-numbers">
            ${suggestion.numbers.map(n => `<span class="suggestion-num">${n}</span>`).join('')}
          </div>
          <div class="suggestion-meta">
            <span class="suggestion-result badge ${
                suggestion.result === 'رقم الصديق مبهم'
                ? 'bg-dark'
                : suggestion.result === 'بدأ'
                ? 'bg-danger'
                : 'bg-success'
                }">⭐ ${suggestion.stars} | 🔵 ${suggestion.dots} = ${suggestion.result}</span>          
          </div>
        </div>
      `).join('');

      friendCol.innerHTML = mySuggestions.map(suggestion => `
        <div class="suggestion-item">
          <div class="suggestion-numbers">
            ${suggestion.numbers.map(n => `<span class="suggestion-num">${n}</span>`).join('')}
          </div>
          <div class="suggestion-meta">
            <span class="suggestion-result badge ${
                suggestion.result === 'رقم الصديق مبهم'
                ? 'bg-dark'
                : suggestion.result === 'بدأ'
                ? 'bg-danger'
                : 'bg-secondary'
                }">⭐ ${suggestion.stars} | 🔵 ${suggestion.dots} = ${suggestion.result}</span>          
          </div>
        </div>
      `).join('');
    }

    function toggleNumber(num, btn) {
      if (selectedNumbers.includes(num)) {
        selectedNumbers = selectedNumbers.filter(n => n !== num);
        btn.classList.remove('selected');
      } else if (selectedNumbers.length < 4) {
        selectedNumbers.push(num);
        btn.classList.add('selected');
      }
      updateDisplay();
    }

    function updateDisplay() {
      const display = document.getElementById('selectedDisplay');
      const statusMsg = document.getElementById('statusMessage');
      const submitBtn = document.getElementById('submitBtn');

      if (selectedNumbers.length === 0) {
        display.innerHTML = '<p style="color: #999; font-size: 0.9rem;">Select 4 numbers</p>';
        statusMsg.innerHTML = '';
        submitBtn.disabled = true;
      } else if (selectedNumbers.length < 4) {
        const nums = selectedNumbers.map(n => `<span class="selected-num">${n}</span>`).join('');
        display.innerHTML = nums + `<p style="color: #999; font-size: 0.9rem; margin-left: 0.5rem;">${4 - selectedNumbers.length} more</p>`;
        statusMsg.innerHTML = '';
        submitBtn.disabled = true;
      } else {
        const nums = selectedNumbers.map(n => `<span class="selected-num">${n}</span>`).join('');
        display.innerHTML = nums;
        statusMsg.innerHTML = '<div class="status success"><i class="ti ti-check"></i>Ready!</div>';
        if (my_friend_win === 1 || my_win === 1)
          submitBtn.disabled = true;
        else
          submitBtn.disabled = false;
      }
    }

    function resetGame() {
      selectedNumbers = [];
      document.querySelectorAll('.number-btn').forEach(btn => btn.classList.remove('selected'));
      updateDisplay();
    }

    async function submitGuess() {
      const guess = selectedNumbers.join('');
      try {
        const response = await fetch(
            `/create/guess?guess=${selectedNumbers.join('')}&user_id=${userId}&hash=${hash}`
        );
        // SERVER ERROR
        if (!response.ok) {
            throw new Error(
                `Server Error: ${response.status}`
            );
        }
        const data = await response.json();
        const statusMsg = document.getElementById('statusMessage');
        const randomResult = data.result;
        const score = data.score;
        const win = data.win; 
        console.log(win)

        gameHistory.push({
            player: 'You',
            numbers: [...selectedNumbers],
            score: score,
            result: randomResult
        });

        friendSuggestions.push({
            numbers: [...selectedNumbers],
            result: randomResult,
            stars: data.stars,
            dots: data.dots
        });
          
          resetGame();
          updateComparison();
          updateHistoryView();
          
          if (win === 1) {
            statusMsg.innerHTML = `<div class="status success"><i class="ti ti-star"></i>تهانينا .. لقد فزت! 🎉</div>`;
          }
      }
      catch(error) {
        console.log(error);
      }

    }

    function switchTab(tabName, evt) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById(tabName).classList.add('active');
      evt.target.classList.add('active');
    }


    function appendGuess(
        my_guess_list,
        friend_guess_list,
        stars,
        dots,
        friend_stars,
        friend_dots
    ){

        // MY guesses
        my_guess_list.forEach(function(number, index){

            mySuggestions.push({
                numbers: number.toString().split('').map(Number),
                result: "Wait",
                stars: stars[index],
                dots: dots[index]
            });

        });

        // FRIEND guesses
        friend_guess_list.forEach(function(number, index){

            friendSuggestions.push({
                numbers: number.toString().split('').map(Number),
                result: "Wait",
                stars: friend_stars[index],
                dots: friend_dots[index]
            });

        });

    }

    function updateHistoryView() {
      const historyContent = document.getElementById('historyContent');
      historyContent.innerHTML = gameHistory.map(game => `
        <div class="history-card">
          <div class="history-header">
            <div class="history-player">${game.player}</div>
            <div class="history-badge ${game.result}">
              <i class="ti ${game.result === 'win' ? 'ti-check' : 'ti-x'}"></i>
              ${game.result === 'win' ? 'Won' : 'Lost'}
            </div>
          </div>
          <div class="numbers-display">
            <p>Numbers</p>
            <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
              ${game.numbers.map(n => `<span class="selected-num">${n}</span>`).join('')}
            </div>
          </div>
          <div class="history-stats">
            <div class="stat-item">
              <div class="stat-label">Score</div>
              <div class="stat-value">${game.score}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Status</div>
              <div class="stat-value" style="color: ${game.result === 'win' ? 'var(--success-color)' : 'var(--danger-color)'}">${game.result === 'win' ? '✓ Win' : '✗ Loss'}</div>
            </div>
          </div>
        </div>
      `).join('');

      const totalGames = gameHistory.length;
      const wins = gameHistory.filter(g => g.result === 'win').length;
      const losses = gameHistory.filter(g => g.result === 'lost').length;
      const winRate = Math.round((wins / totalGames) * 100);

      document.getElementById('totalPlayed').textContent = totalGames;
      document.getElementById('totalWins').textContent = wins;
      document.getElementById('totalLosses').textContent = losses;
      document.getElementById('winRate').textContent = winRate + '%';
    }