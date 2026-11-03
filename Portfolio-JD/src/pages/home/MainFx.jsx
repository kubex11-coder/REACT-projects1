// Světelné a "živé" efekty na hlavní ilustraci (stůl s monitory). Všechno jsou
// průhledné překryvy v souřadnicích původního obrázku 1536×1024, převedené na %.
const px = (x) => `${((x / 1536) * 100).toFixed(2)}%`
const py = (y) => `${((y / 1024) * 100).toFixed(2)}%`
const poly = (pts) => `polygon(${pts.map(([x, y]) => `${px(x)} ${py(y)}`).join(",")})`
const box = (x, y, w, h) => ({ left: px(x), top: py(y), width: px(w), height: py(h) })

const MainFx = () => (
    <>
        {/* displeje: světelný pruh pomalu přejíždí shora dolů */}
        <div
            className="fx fx-screen"
            style={{ clipPath: poly([[72, 296], [432, 332], [436, 572], [335, 578], [302, 500], [300, 468], [72, 456]]) }}
        />
        <div
            className="fx fx-screen fx-screen-b"
            style={{ clipPath: poly([[1108, 338], [1482, 290], [1484, 460], [1330, 478], [1275, 540], [1265, 575], [1130, 590]]) }}
        />

        {/* svítící panel: teplé pulzování a záře kolem */}
        <div className="fx fx-halo" style={box(1040, 0, 420, 330)} />
        <div
            className="fx fx-lamp"
            style={{ clipPath: poly([[1146, 130], [1295, 108], [1318, 196], [1166, 224]]) }}
        />

        {/* RGB klávesnice: barevná vlna */}
        <div className="fx fx-key" style={{ clipPath: poly([[452, 762], [938, 744], [945, 795], [452, 797]]) }} />

        {/* logo na mikině */}
        <div className="fx fx-logo" style={box(855, 480, 90, 60)} />

        {/* pára z hrnku */}
        <div className="fx fx-steam" style={box(335, 640, 44, 64)} />
        <div className="fx fx-steam fx-steam-b" style={box(370, 650, 38, 58)} />
    </>
)

export default MainFx
