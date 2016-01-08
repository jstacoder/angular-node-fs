
makePadd = (char,num)->
    res = []
    for x in [1..num]
        res.push char
    res.join ""

fmtstr = (s,splitchar,size,padchar)->
    splitchar = splitchar or '--'
    size = size or 40
    padchar = padchar or ' '
    #console.log s
    parts = String(s).split(splitchar)
    padlen = size - (parts[0].length + parts[1].length)
    padd = makePadd padchar,padlen
    "#{parts[0]}#{padd}#{parts[1]}"


runtest = ()->
    s1 = "hmmm xxx ending"
    s2 = "more stuff xxx grrrrrrrr"
    s3 = "the is a fmt xxx whyyyyyy"


    for itm in [s1,s2,s3]
        console.log fmtstr(itm,"xxx")


module.exports = fmtstr
