import fs from 'fs';


export default class Logger{
    private log:fs.WriteStream
    private LogLevel:LogSetting
    constructor(Level:LogSetting){
        this.LogLevel = Level;
        this.log = fs.createWriteStream('log.txt', { flags: 'a' });
    }
    /**Used to Log Debug Message. Messages will be Ignored if the Log Classes Level is greater than the input level. default = 1, Condensed Messaged*/
    public print(Message:string, Level:LogSetting =1){
        if(this.LogLevel=2){ return }
        else if(Level>= this.LogLevel){
            const LogDate = new Date().toString
            this.log.write(`${LogDate}: -- ${Message}\n`);
        }
        else {return}
    }

    public CloseLog(){
        this.log.end();
    }
}

enum LogSetting{
    Verbose,
    Condensed,
    Ignore
}