<style>
    .game-btn{
        border-radius: 4px;
        padding: 4px;
        font-weight: bold !important;
        margin: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
<main>
   
    <div class="flex flex-content-center flex-item-center flex-wrap" style="margin-top: 4rem;">
        <a href="<?= base_url('play/tetris') ?>" class="game-btn">
            <img src="<?= base_url('assets/icon/tetris.png') ?>" width="65" height="auto">
            <span>Play Tetris</span>
        </a>
        <a href="<?= base_url('play/bowling') ?>" class="game-btn">
            <img src="<?= base_url('assets/icon/bowling.png') ?>" width="65" height="auto">
            <span>Play Bowling</span>
        </a>
        <a href="<?= base_url('play/tictactoe') ?>" class="game-btn">
            <img src="<?= base_url('assets/icon/tictactoe.png') ?>" width="65" height="auto">
            <span>Play Tic-tac-toe</span>
        </a>
         <a href="<?= base_url('play-earn') ?>" class="game-btn">
            <img src="<?= base_url('assets/icon/quizTimeNew.png') ?>" width="90" height="auto">
            <span>Play Quiz</span>
        </a>
    </div>
</main>
