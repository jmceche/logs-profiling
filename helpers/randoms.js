const random = (cant) => {
  const randoms = [];
  let qty = parseInt(cant) || 100000000;
  for (let i = 0; i < qty; i++) {
    randoms.push(Math.floor(Math.random() * 1000));
  }
  return randoms
}

process.on("message", (msg) => { 
  if (msg === "START") {
    console.log("START")
    const randoms = random(process.argv[2])
    process.send(randoms)
    process.exit()
  } else {
    console.log("ERROR")
  }
 });
process.send("READY")