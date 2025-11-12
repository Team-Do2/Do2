$urlVS = "https://aka.ms/highdpimfc2013x64enu"
$outputPathVS = ".\Artifacts\dependencyOne.exe"

$urlMySQLServer = "https://dev.mysql.com/get/Downloads/MySQL-9.5/mysql-9.5.0-winx64.msi"
$outputPathMySQLServer = ".\Artifacts\installerMain.exe"

$executablePath = "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe"

# $db_name = "do2test" $db_name
# $username = ""  --user=$username
$password = "test"

Invoke-WebRequest -Uri $urlVS -OutFile $outputPathVS
.\Artifacts\dependencyOne.exe


Invoke-WebRequest -Uri $urlMySQLServer -OutFile $outputPathMySQLServer
.\Artifacts\installerMain.exe

& $executablePath -u root --password=$password