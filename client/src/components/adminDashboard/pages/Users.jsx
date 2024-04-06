// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import AdminNavBar from './AdminNavBar'
import SearchCat from './SearchCat'
import AdminTable from './AdminTable'
const Users = () => {
  const [searchInput,setSearchInput] = useState("");
  const [data,setData] = useState([{"firstName":"Maible","lastName":"Veeler","email":"mveeler0@furl.net","joinDate":"12/11/2023"},
  {"firstName":"Jackie","lastName":"Prichard","email":"jprichard1@illinois.edu","joinDate":"1/29/2024"},
  {"firstName":"Bessy","lastName":"Greenroyd","email":"bgreenroyd2@trellian.com","joinDate":"3/6/2024"},
  {"firstName":"Nev","lastName":"Detloff","email":"ndetloff3@facebook.com","joinDate":"8/8/2023"},
  {"firstName":"Roseann","lastName":"Tryhorn","email":"rtryhorn4@delicious.com","joinDate":"12/24/2023"},
  {"firstName":"Hedvige","lastName":"Antonazzi","email":"hantonazzi5@plala.or.jp","joinDate":"11/24/2023"},
  {"firstName":"Briano","lastName":"Caistor","email":"bcaistor6@comsenz.com","joinDate":"6/13/2023"},
  {"firstName":"Munroe","lastName":"Cristoferi","email":"mcristoferi7@mit.edu","joinDate":"1/10/2024"},
  {"firstName":"Tommy","lastName":"Denny","email":"tdenny8@tmall.com","joinDate":"10/19/2023"},
  {"firstName":"Cecil","lastName":"Artus","email":"cartus9@stanford.edu","joinDate":"11/18/2023"},
  {"firstName":"Clemente","lastName":"Windous","email":"cwindousa@dropbox.com","joinDate":"6/16/2023"},
  {"firstName":"Florida","lastName":"Dukesbury","email":"fdukesburyb@icq.com","joinDate":"12/29/2023"},
  {"firstName":"Raymund","lastName":"Damper","email":"rdamperc@bravesites.com","joinDate":"3/4/2024"},
  {"firstName":"Kylynn","lastName":"Spaight","email":"kspaightd@youtu.be","joinDate":"10/31/2023"},
  {"firstName":"Orelie","lastName":"Marousek","email":"omarouseke@usda.gov","joinDate":"11/16/2023"},
  {"firstName":"Mahmoud","lastName":"Bartalini","email":"mbartalinif@independent.co.uk","joinDate":"8/31/2023"},
  {"firstName":"Cirilo","lastName":"Clackson","email":"cclacksong@comcast.net","joinDate":"7/7/2023"},
  {"firstName":"Lynn","lastName":"Hilley","email":"lhilleyh@artisteer.com","joinDate":"3/30/2024"},
  {"firstName":"Matthieu","lastName":"Kleinert","email":"mkleinerti@privacy.gov.au","joinDate":"2/5/2024"},
  {"firstName":"Siana","lastName":"Garber","email":"sgarberj@purevolume.com","joinDate":"1/18/2024"},
  {"firstName":"Elva","lastName":"Lobe","email":"elobek@wix.com","joinDate":"12/13/2023"},
  {"firstName":"Mady","lastName":"Radolf","email":"mradolfl@addtoany.com","joinDate":"2/24/2024"},
  {"firstName":"Bette","lastName":"Hallagan","email":"bhallaganm@mysql.com","joinDate":"3/26/2024"},
  {"firstName":"Nil","lastName":"McRavey","email":"nmcraveyn@github.io","joinDate":"5/28/2023"},
  {"firstName":"Martainn","lastName":"Romaynes","email":"mromayneso@sciencedirect.com","joinDate":"9/3/2023"},
  {"firstName":"Vassily","lastName":"Petz","email":"vpetzp@google.ru","joinDate":"10/14/2023"},
  {"firstName":"Niel","lastName":"Bedding","email":"nbeddingq@icq.com","joinDate":"8/28/2023"},
  {"firstName":"Urban","lastName":"Goose","email":"ugooser@nyu.edu","joinDate":"7/15/2023"},
  {"firstName":"Cathie","lastName":"MacFadin","email":"cmacfadins@ucla.edu","joinDate":"3/6/2024"},
  {"firstName":"Judith","lastName":"Nickols","email":"jnickolst@disqus.com","joinDate":"1/10/2024"},
  {"firstName":"Cristi","lastName":"Gilford","email":"cgilfordu@hp.com","joinDate":"4/25/2023"},
  {"firstName":"Kory","lastName":"Ilden","email":"kildenv@kickstarter.com","joinDate":"7/13/2023"},
  {"firstName":"Lou","lastName":"Dionisio","email":"ldionisiow@naver.com","joinDate":"6/9/2023"},
  {"firstName":"Philipa","lastName":"Gwyllt","email":"pgwylltx@google.com.au","joinDate":"5/13/2023"},
  {"firstName":"Rollins","lastName":"Garlant","email":"rgarlanty@google.de","joinDate":"4/22/2023"},
  {"firstName":"Antonina","lastName":"Phizackerly","email":"aphizackerlyz@hp.com","joinDate":"2/24/2024"},
  {"firstName":"Eb","lastName":"Muxworthy","email":"emuxworthy10@marketwatch.com","joinDate":"4/15/2023"},
  {"firstName":"Starr","lastName":"Farndon","email":"sfarndon11@apple.com","joinDate":"3/23/2024"},
  {"firstName":"Babara","lastName":"McGuggy","email":"bmcguggy12@gnu.org","joinDate":"10/28/2023"},
  {"firstName":"Gray","lastName":"MacCleay","email":"gmaccleay13@wufoo.com","joinDate":"7/31/2023"},
  {"firstName":"Kennie","lastName":"Drysdall","email":"kdrysdall14@w3.org","joinDate":"11/21/2023"},
  {"firstName":"Miltie","lastName":"Skpsey","email":"mskpsey15@businesswire.com","joinDate":"2/13/2024"},
  {"firstName":"Melony","lastName":"Ewens","email":"mewens16@examiner.com","joinDate":"5/10/2023"},
  {"firstName":"Camey","lastName":"Beatson","email":"cbeatson17@nyu.edu","joinDate":"12/8/2023"},
  {"firstName":"Merlina","lastName":"Roby","email":"mroby18@goo.gl","joinDate":"3/7/2024"},
  {"firstName":"Ursola","lastName":"Steynor","email":"usteynor19@sbwire.com","joinDate":"11/30/2023"},
  {"firstName":"Ansel","lastName":"Parkeson","email":"aparkeson1a@biblegateway.com","joinDate":"9/22/2023"},
  {"firstName":"Riordan","lastName":"Sleaford","email":"rsleaford1b@blog.com","joinDate":"8/24/2023"},
  {"firstName":"Vivyanne","lastName":"Cordero","email":"vcordero1c@who.int","joinDate":"4/29/2023"},
  {"firstName":"Jillane","lastName":"Whorf","email":"jwhorf1d@homestead.com","joinDate":"10/23/2023"},
  {"firstName":"Edy","lastName":"Waplinton","email":"ewaplinton1e@meetup.com","joinDate":"8/24/2023"},
  {"firstName":"Vinny","lastName":"Goundrill","email":"vgoundrill1f@webnode.com","joinDate":"8/7/2023"},
  {"firstName":"Camilla","lastName":"Giacomoni","email":"cgiacomoni1g@marketwatch.com","joinDate":"7/13/2023"},
  {"firstName":"Cheryl","lastName":"Milburn","email":"cmilburn1h@about.me","joinDate":"5/2/2023"},
  {"firstName":"Margarete","lastName":"Simonard","email":"msimonard1i@so-net.ne.jp","joinDate":"1/22/2024"},
  {"firstName":"Merrill","lastName":"Milsap","email":"mmilsap1j@boston.com","joinDate":"4/16/2023"},
  {"firstName":"Emily","lastName":"Emburey","email":"eemburey1k@issuu.com","joinDate":"11/27/2023"},
  {"firstName":"Brit","lastName":"Wapples","email":"bwapples1l@illinois.edu","joinDate":"8/23/2023"},
  {"firstName":"Liliane","lastName":"Greyes","email":"lgreyes1m@blogs.com","joinDate":"6/13/2023"},
  {"firstName":"Sofie","lastName":"Lashford","email":"slashford1n@umich.edu","joinDate":"8/5/2023"},
  {"firstName":"Giselle","lastName":"Jenton","email":"gjenton1o@rambler.ru","joinDate":"9/30/2023"},
  {"firstName":"Frayda","lastName":"Hallmark","email":"fhallmark1p@scribd.com","joinDate":"5/17/2023"},
  {"firstName":"Cecilius","lastName":"Gandey","email":"cgandey1q@utexas.edu","joinDate":"9/28/2023"},
  {"firstName":"Joe","lastName":"Stanway","email":"jstanway1r@people.com.cn","joinDate":"11/26/2023"},
  {"firstName":"Fredi","lastName":"Malim","email":"fmalim1s@java.com","joinDate":"12/7/2023"},
  {"firstName":"Kiele","lastName":"Blakesley","email":"kblakesley1t@slideshare.net","joinDate":"12/23/2023"},
  {"firstName":"Olav","lastName":"Massimi","email":"omassimi1u@netscape.com","joinDate":"4/19/2023"},
  {"firstName":"Vernon","lastName":"Warmington","email":"vwarmington1v@tuttocitta.it","joinDate":"2/20/2024"},
  {"firstName":"Cori","lastName":"Rudolfer","email":"crudolfer1w@nsw.gov.au","joinDate":"2/2/2024"},
  {"firstName":"Ashly","lastName":"Zambon","email":"azambon1x@wiley.com","joinDate":"6/15/2023"},
  {"firstName":"Mead","lastName":"Billett","email":"mbillett1y@addthis.com","joinDate":"11/1/2023"},
  {"firstName":"Kahaleel","lastName":"Fuggle","email":"kfuggle1z@webmd.com","joinDate":"5/13/2023"},
  {"firstName":"Kaycee","lastName":"Kefford","email":"kkefford20@squarespace.com","joinDate":"5/9/2023"},
  {"firstName":"Gratiana","lastName":"Leonarde","email":"gleonarde21@forbes.com","joinDate":"11/14/2023"},
  {"firstName":"Devondra","lastName":"Croster","email":"dcroster22@yahoo.co.jp","joinDate":"3/26/2024"},
  {"firstName":"Si","lastName":"Tomich","email":"stomich23@usa.gov","joinDate":"6/22/2023"},
  {"firstName":"Inglebert","lastName":"Cluderay","email":"icluderay24@oakley.com","joinDate":"9/14/2023"}])
  const columns=[
    {
      header:"Full name",
      accessorFn:row=>`${row.firstName} ${row.lastName}`
    },
    {
      header:"Email",
      accessorKey:'email'
    },{
      header:"Date",
      accessorKey:'joinDate'
    }
]
  return (
    <>
      <AdminNavBar location='Users'/>
      <SearchCat setSearchInput={setSearchInput}/>
      <AdminTable data={data} columns={columns} searchInput={searchInput} setSearchInput={setSearchInput}/>
    </>
  )
}

export default Users