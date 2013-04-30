(function(context){
  var logField = document.getElementById("log");
  var appId=document.getElementById("appId");
  var writeText=document.getElementById("writeText");
  var write=document.getElementById("write");
  var read=document.getElementById("read");

  write.addEventListener('click', function() {
    appendLog("writing: "+writeText.value);
    chrome.runtime.sendMessage(
      appId.value,
      {command: "write", data: writeText.value},
      function(response) {
        appendLog("response: "+JSON.stringify(response));
      });
  });

  read.addEventListener('click', function() {
    appendLog("reading...");
    chrome.runtime.sendMessage(
      appId.value,
      {command: "read"},
      function(response) {
        appendLog("response: "+JSON.stringify(response));
      });
  });

  var appendLog = function(message) {
    logField.innerText+="\n"+message;
  };

  context.appendLog = appendLog;

})(window)
