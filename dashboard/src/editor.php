<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Editor</title>
  <style type="text/css" media="screen">
    body {
        overflow: hidden;
    }

    #editor {
        margin: 0;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 100px;
        right: 0;
        width: 900px; 
        height: 900px;
    }
  </style>
</head>
<body>
  <?php
  // Connecting, selecting database
  $dbconn = pg_connect("host=localhost dbname=walle_testing user=jovan_wee password=b747400s port=5432")
      or die('Could not connect: ' . pg_last_error());
  
  // Performing SQL query
  $query = 'SELECT * FROM guild.configuration';
  $result = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
  
  $arr = pg_fetch_array($result, 0, PGSQL_NUM);
  
  // Free resultset
  pg_free_result($result);
  
  // Closing connection
  pg_close($dbconn);

  ?>

  <pre id="editor">
  <?php echo $arr[3]; ?>
  </pre>
  

<script src="ace-editor/src/ace.js" type="text/javascript" charset="utf-8"></script>
<script>
    var editor = ace.edit("editor");
    console.log(editor.getValue());
    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/yaml");
    
    
</script>
<form action="" method="post">
  <button type="submit" onclick="console.log(editor.getValue()); const update_config = editor.getValue();" name='updatebutton'>Click me</button>
</form>
<h1>Note</h1>
<?php
  if(isset($_POST["updatebutton"]))
  {
  echo "<script>document.writeln(update_config);</script>";
  }
?>
</body>
</html>
