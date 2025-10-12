import * as preview from "../../../../main/js/components/cv/Preview";

describe("Preview.test", () => {

  it("should wrap text 1000", () => {
    expect(preview.wrapText("A B C d e f G H I j k l M N O p q r S T U v w x Y Z", 1000))
      .toBe("A B C d e f G H I j k l M N O p q r S T U v w x Y Z");
  });

  it("should wrap text 30", () => {
    expect(preview.wrapText("A B C d e f G H I j k l M N O p q r S T U v w x Y Z", 30))
      .toBe("A B C d e f G H I j"
        + "\nk l M N O p q r S T"
        + "\nU v w x Y Z");
  });

  it("should wrap text 20", () => {
    expect(preview.wrapText("A B C d e f G H I j k l M N O p q r S T U v w x Y Z", 20))
      .toBe("A B C d e f"
        + "\nG H I j k l M"
        + "\nN O p q r S"
        + "\nT U v w x Y"
        + "\nZ");
  });

  it("should wrap text 10", () => {
    expect(preview.wrapText("A B C d e f G H I j k l M N O p q r S T U v w x Y Z", 10))
      .toBe("A B C"
        + "\nd e f"
        + "\nG H I"
        + "\nj k l M"
        + "\nN O p"
        + "\nq r S"
        + "\nT U v"
        + "\nw x Y"
        + "\nZ");
  });

  it("should wrap text 1", () => {
    expect(preview.wrapText("A B C d e f G H I j k l M N O p q r S T U v w x Y Z", 1))
      .toBe("A"
        + "\nB"
        + "\nC"
        + "\nd"
        + "\ne"
        + "\nf"
        + "\nG"
        + "\nH"
        + "\nI"
        + "\nj"
        + "\nk"
        + "\nl"
        + "\nM"
        + "\nN"
        + "\nO"
        + "\np"
        + "\nq"
        + "\nr"
        + "\nS"
        + "\nT"
        + "\nU"
        + "\nv"
        + "\nw"
        + "\nx"
        + "\nY"
        + "\nZ");
  });
});