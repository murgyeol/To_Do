Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run "python server.py", 0, False
WScript.Sleep 1500
WshShell.Run "http://localhost:8000/", 1, False
