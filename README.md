Написана программа, которая ищет файлы в указанной дериктории и отправляет пути к этим файлам на почту в эксель файле.

    --PATTERN=.js / --PATTERN=node_modules регулярка, которая ищет файлы соответственным требованиям.
    --TYPE=D/F , D-Directory, F-File. 
    --EMAIT-TO=example@gmail.ru   почту, на которую отправлять данные.
    --MAX-SIZE=5B/K/M/G 
    --MIN-SIZE=1B/K/M/G
    --DIR="путь где искать файлы"

Поиск файлов осуществляется рекурсивно с использованием колбеков. 

##Examples
1. index.js --DIR=/Users/leonid/Downloads --PATTERN=.js --EMAIL-TO=leonid.baida@gmail.com
2. index.js --DIR=/Users/leonid/Downloads --TYPE=D --EMAIL-TO=leonid.baida@gmail.com
3. index.js --PATTERN=.mkv --TYPE=F --MIN-SIZE=4G --DIR=/Users/leonid/Downloads --EMAIL-TO=leonid.baida@gmail.com
4. index.js --PATTERN=.mkv --TYPE=F --MIN-SIZE=4G --DIR=/Users/leonid/Downloads --EMAIL-TO=leonid.baida@gmail.com

##RESULT
/Users/leonid/Downloads/The.Pacific.S01.1080p.BDRip.5xRus.Eng.HDCLUB/The.Pacific.S01E09.1080p.BDRip.5xRus.Eng.HDCLUB.mk
 /Users/leonid/Downloads/The.Pacific.S01.1080p.BDRip.5xRus.Eng.HDCLUB/The.Pacific.S01E07.1080p.BDRip.5xRus.Eng.HDCLUB.mkv           
 /Users/leonid/Downloads/The.Pacific.S01.1080p.BDRip.5xRus.Eng.HDCLUB/The.Pacific.S01E08.1080p.BDRip.5xRus.Eng.HDCLUB.mkv
 /Users/leonid/Downloads/The.Pacific.S01.1080p.BDRip.5xRus.Eng.HDCLUB/The.Pacific.S01E10.1080p.BDRip.5xRus.Eng.HDCLUB.mkv
