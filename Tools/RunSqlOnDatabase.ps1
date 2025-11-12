param(
    [Parameter(Mandatory=$true)]
    [string]$sqlFile
)

$executablePath = "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe"
# $sqlFile = ".\TestHarness\Database\InsertTestData.sql"
# $databaseName = "your_database_name"
$username = "root"
$password = "test"

Get-Content $sqlFile | & $executablePath -u"$username" -p"$password"