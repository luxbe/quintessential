// starts from 2021-02-07

import { RANDOMS } from './randomPuzzles'

export const DAILIES = [
  [0, 'pizza,bacon,sauce,curds,crust', 'sucsc,uaudn,pabae,zcros,crizt'], // food-1
  [0, 'herbs,thyme,onion,basil,chard', 'hnobh,ssyce,oeirr,bdtil,mahna'], // food-2
  [0, 'china,india,japan,napal,yemen', 'cjaae,iadpn,hapnn,aniil,namey'], // countries-1
  [0, 'spain,samoa,qatar,syria,italy', 'satmr,riiop,laaas,yynia,ataqs'], // countries-2
  [0, 'bagel,cream,caper,seeds,toast', 'ragtt,cbeea,odpee,sraas,ecmsl'], // food-3
  [0, 'sushi,knife,algae,trout,gills', 'gnsti,luioe,rlgat,eafsh,silku'], // food-4
  [0, 'space,phase,probe,cloak,prime', 'srrke,bhesm,ppopa,olcac,eaiep'], // star-trek-1
  [0, 'spock,riker,quark,seven,phlox', 'qiokc,lpksr,sraun,eevek,xhrop'], // star-trek-2
  [0, 'melon,apple,grape,peach,lemon', 'megeo,pmelp,leapo,arach,lnpne'], // fruit-1
  [0, 'limes,berry,kiwis,pears,mango', 'kieei,amrsy,liwsr,pgbns,oarem'], // fruit-2
  [0, 'blues,swing,metal,salsa,disco', 'buums,itiac,ehwnl,eolse,ossgd'], // music-1
  [0, 'urban,samba,house,dance,indie', 'uosen,bueba,irada,eancd,hnsim'], // music-2
  [0, 'bruce,peggy,clint,bucky,shuri', 'ckcbe,yeigp,crihb,tuury,snulg'], // mcu-1
  [0, 'widow,peter,stark,quill,carol', 'lodea,poter,ltwli,ruksr,caqiw'], // mcu-2
  [0, 'drink,latte,break,beans,steam', 'kannb,lemse,traad,keais,tbert'], // coffee-1
  [0, 'mocha,irish,cream,sugar,brown', 'manis,hriar,rrwom,bugah,scoec'], // coffee-2
]

let dailies = [...DAILIES]
export const PUZZLES = [...RANDOMS]
let i = 5
while (dailies.length > 1) {
  PUZZLES.splice(i, 0, dailies.shift())
  PUZZLES.splice(i + 1, 0, dailies.shift())
  i += 7
}
