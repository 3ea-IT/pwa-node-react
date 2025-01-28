<!DOCTYPE html> 
    <html> 
        <head> 
            <script>
                var bowling_url = '<?= base_url("assets/bowling") ?>';
            </script>
            <title></title> 
            <link rel="stylesheet" href="<?= base_url('assets/bowling') ?>/css/reset.css" type="text/css"> 
            <link rel="stylesheet" href="<?= base_url('assets/bowling') ?>/css/main.css" type="text/css"> 
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
            <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,minimal-ui" /> 
            <meta name="msapplication-tap-highlight" content="no"/> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/jquery-2.0.3.min.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/createjs-2015.11.26.min.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/ctl_utils.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/sprite_lib.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/settings.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CLang.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CPreloader.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CMain.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CTextButton.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CToggle.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CGfxButton.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CMenu.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CGame.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CInterface.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CHelpPanel.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/cannon.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/cannon.demo.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CBall.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CScenario.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/Three.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/Detector.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/smoothie.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/Stats.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/TrackballControls.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/dat.gui.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CAreYouSurePanel.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CCreditsPanel.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CPin.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CPowerBar.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CTurnsBoard.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CTurnBoard.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CTrack.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CEffectArray.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CCharacter.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CAnimMonitor.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CPinDragger.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CSemaphore.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CTotalScoreBoard.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CEndPanel.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/CController.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/FBXLoader.js"></script> 
            <script type="text/javascript" src="<?= base_url('assets/bowling') ?>/js/TransformControls.js"></script> 
             <script type="text/javascript">
                // Assuming these values are set by some server-side logic or pre-existing scripts
                var csrf_value = '<?= $this->security->get_csrf_hash(); ?>'; // CSRF token value
                var csrf_token = '<?= $this->security->get_csrf_token_name(); ?>'; // CSRF token name
            </script>
            <script type="text/javascript">
                // Set the name and value of the CSRF token in the hidden input
                document.addEventListener('DOMContentLoaded', function() {
                    var csrfField = document.getElementById('csrf');
                    csrfField.name = csrf_token; // Set the token name
                    csrfField.value = csrf_value; // Set the token value
                });
            </script>
            <style>
                body{
                    background-image: url(<?= base_url('assets/bowling') ?>/sprites/bg_tile.jpg); 
                }
            </style>
    </head> 
        <body ondragstart="return false;" ondrop="return false;" > 
            <div style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%">
            </div> 
            <input type="hidden" name="" value="" id="csrf">
        <script> 
        $(document).ready(function () {
                var oMain = new CMain({ time_power_bar: 750, 
            }); 
            $(oMain).on("start_session", function (evt) { if (getParamValue('ctl-arcade') === "true") { parent.__ctlArcadeStartSession(); } }); $(oMain).on("end_session", function (evt) { if (getParamValue('ctl-arcade') === "true") { parent.__ctlArcadeEndSession(); } }); $(oMain).on("start_level", function (evt, iLevel) { if (getParamValue('ctl-arcade') === "true") { parent.__ctlArcadeStartLevel({level: iLevel}); } }); $(oMain).on("restart_level", function (evt, iLevel) { if (getParamValue('ctl-arcade') === "true") { parent.__ctlArcadeRestartLevel({level: iLevel}); } }); $(oMain).on("end_level", function (evt, iLevel) { if (getParamValue('ctl-arcade') === "true") { parent.__ctlArcadeEndLevel({level: iLevel}); } }); $(oMain).on("save_score", function (evt, iScore, szMode) { if (getParamValue('ctl-arcade') === "true") { parent.__ctlArcadeSaveScore({score: iScore, mode: szMode}); } }); $(oMain).on("show_interlevel_ad", function (evt) { if (getParamValue('ctl-arcade') === "true") { parent.__ctlArcadeShowInterlevelAD(); } }); $(oMain).on("share_event", function (evt, iScore) { if (getParamValue('ctl-arcade') === "true") { parent.__ctlArcadeShareEvent({img: TEXT_SHARE_IMAGE, title: TEXT_SHARE_TITLE, msg: TEXT_SHARE_MSG1 + iScore + TEXT_SHARE_MSG2, msg_share: TEXT_SHARE_SHARE1 + iScore + TEXT_SHARE_SHARE1}); } }); if (isIOS()) { setTimeout(function () { sizeHandler(); }, 200); } else { sizeHandler(); } }); 
        </script> 
        <canvas id="canvas" class='ani_hack' width="790" height="1410"> </canvas> <div id="block_game" style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%; display:none"></div> </body> </html>