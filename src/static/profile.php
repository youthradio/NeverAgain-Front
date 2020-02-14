<!-- https://stackoverflow.com/questions/18381710/building-twitter-profile-image-url-with-twitter-user-id -->
<?php
if (!isset($_GET['id'])) $_GET['id'] = 'twitter';
$urlget = curl_init();
curl_setopt($urlget, CURLOPT_URL, 'https://twitter.com/' . $_GET['id'] . '/profile_image?size=normal');
curl_setopt($urlget, CURLOPT_HEADER, true);
curl_setopt($urlget, CURLOPT_RETURNTRANSFER, 1);
$res = curl_exec($urlget);
preg_match_all("/location: (.*)/", $res, $found);
header('Location: ' . $found[1][0]);
?>