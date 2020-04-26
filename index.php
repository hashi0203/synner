<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Synner</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <!-- import the webpage's stylesheet -->
    <link rel="stylesheet" href="/style.css">
    
    <!-- import the webpage's javascript file -->
    <script src="/script.js" defer></script>
  </head>  
  <body>
    <?php
    $data_number = 1000;
    $col = 2;
    ?>
    
    
    <header style="color:white;">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active">
              <h3>Synner</h3>
            </li>
          </ul>
          <ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex">
            <li class="nav-item">
              <span style="padding-right:10px;opacity:0.5;">Dataset Size:</span><input type="number" value="<?=$data_number?>">
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Download Data</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Script
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item" href="#"><label>Load<input type="file" style="display:none;"></label></a>
                <a class="dropdown-item" href="#">Save</a>
              </div>
            </li>
            <li>
              <div class="glitchButton"></div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
      
    <table border="1" style="border-collapse: collapse">
<!--       <tr id="data-tables"> -->
      <thead>
        <tr>
          <?php
          for ($i=0; $i<$col; $i++) {
          echo "
            <th>
              <input type='text' id='title".$i."' value='Column".$i."'>
            </th>
          "; } ?>
        </tr>
        <tr>
          <?php
          for ($i=0; $i<$col; $i++) {
          echo "
            <td>
              <div class='chart-container'>
                <canvas id='canvas".$i."'>
              </div>
            </td>
          "; } ?>
        </tr>
        <tr>
          <?php
          for ($i=0; $i<$col; $i++) {
          echo "
            <td>Depends on: </td>
          "; } ?>
        </tr>
      </thead>
      <tbody height=100>
        <div class="data-scroll">
          <?php
          for($i=0; $i < $data_number; $i++){
            echo "
              <tr>
                <td>".$i."</td>
              </tr>
          "; } ?>
        </div>
      </tbody>
      
    </table>
    
    <div id="data-detail" style="width: 100%; border-top: solid 2px black;">
      <table>
        <tr id="data-detail-title"></tr>
        <tr id="data-detail-content"></tr>
      </table>
    </div>
    
    <!-- include the Glitch button to show what the webpage is about and
          to make it easier for folks to view source and remix -->
<!--     <div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div> -->
    <script src="https://button.glitch.me/button.js"></script>
  </body>
</html>
