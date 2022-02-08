// starts from 2021-02-07

import { RANDOMS } from './randomPuzzles'

export const DAILIES = [
  ['pizza,bacon,sauce,curds,crust', 'sucsc,uaudn,pabae,zcros,crizt'], // food-1
  ['herbs,thyme,onion,basil,chard', 'hnobh,ssyce,oeirr,bdtil,mahna'], // food-2
  ['swine,rhino,tapir,fitch,zebra', 'pwhnr,riiaf,easre,otich,ztbin'], // animal-1
  ['koala,steer,horse,lemur,tiger', 'eomrl,htkei,surse,agaol,treer'], // animal-2
  ['china,india,japan,napal,yemen', 'cjaae,iadpn,hapnn,aniil,namey'], // countries-1
  ['spain,samoa,qatar,syria,italy', 'satmr,riiop,laaas,yynia,ataqs'], // countries-2
  ['bagel,cream,caper,seeds,toast', 'ragtt,cbeea,odpee,sraas,ecmsl'], // food-3
  ['sushi,knife,algae,trout,gills', 'gnsti,luioe,rlgat,eafsh,silku'], // food-4
  ['space,phase,probe,cloak,prime', 'srrke,bhesm,ppopa,olcac,eaiep'], // star-trek-1
  ['spock,riker,quark,seven,phlox', 'qiokc,lpksr,sraun,eevek,xhrop'], // star-trek-2
  ['chimp,sheep,tabby,panda,bison', 'eboma,pehcp,tadhb,spnba,yisin'], // animal-3
  ['sloth,hippo,camel,shrew,moose', 'lseph,hsptl,caheo,emosw,morio'], // animal-4
  ['melon,apple,grape,peach,lemon', 'megeo,pmelp,leapo,arach,lnpne'], // fruit-1
  ['limes,berry,kiwis,pears,mango', 'kieei,amrsy,liwsr,pgbns,oarem'], // fruit-2
  ['wires,chain,board,plane,knife', 'pfnec,shnda,noaii,wlare,kbrie'], // tools-1
  ['screw,nails,drill,bolts,bench', 'bnrba,cwirs,dlihl,eoets,slcnl'], // tools-2
  ['blues,swing,metal,salsa,disco', 'buums,itiac,ehwnl,eolse,ossgd'], // music-1
  ['urban,samba,house,dance,indie', 'uosen,bueba,irada,eancd,hnsim'], // music-2
  ['bruce,peggy,clint,bucky,shuri', 'ckcbe,yeigp,crihb,tuury,snulg'], // mcu-1
  ['widow,peter,stark,quill,carol', 'lodea,poter,ltwli,ruksr,caqiw'], // mcu-2
  ['drink,latte,break,beans,steam', 'kannb,lemse,traad,keais,tbert'], // coffee-1
  ['mocha,irish,cream,sugar,brown', 'manis,hriar,rrwom,bugah,scoec'], // coffee-2
  ['whale,llama,skunk,hyena,mouse', 'wknly,elsms,ahmnh,keeaa,uoual'], // animal-5
  ['sable,stoat,otter,puppy,dingo', 'tirle,sspto,ytaeb,pnpoo,daugt'], // animal-6
  ['honda,tesla,chevy,buick,acura', 'henul,ucsaa,hcoay,bdicr,aetkv'], // cars-1
  ['dodge,lexus,mazda,scion,volvo', 'dogdi,mvaaz,lxsdu,csvon,eoleo'], // cars-2
]

let dailies = [...DAILIES]
export const PUZZLES = [...RANDOMS]
let i = 5
while (dailies.length > 1) {
  PUZZLES.splice(i, 0, dailies.shift())
  PUZZLES.splice(i + 1, 0, dailies.shift())
  i += 7
}
