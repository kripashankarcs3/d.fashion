import { describe, expect, it } from "vitest";
import { generateStylistReply, type StylistContext } from "../src/services/stylist.service";

const warmContext: StylistContext = {
  analysisResult: {
    colorProfile: {
      undertone: "warm",
      skinToneHex: "#C99B6A",
      lipColor: "#C97B84",
    },
    colourSeason: "Warm Autumn",
  },
};

const coolContext: StylistContext = {
  analysisResult: {
    colorProfile: { undertone: "cool", skinToneHex: "#D4A89C" },
    colourSeason: "Cool Winter",
  },
};

describe("generateStylistReply", () => {
  it("handles occasion requests (wedding)", () => {
    const reply = generateStylistReply("What colours should I wear for a wedding?", warmContext);
    expect(reply).toContain("a wedding");
    expect(reply).toContain("Warm Autumn");
    expect(reply).toContain("Colours I would reach for first");
  });

  it("handles skincare requests with personalised steps", () => {
    const reply = generateStylistReply("My skin gets acne and dark spots, any routine?", {
      analysisResult: { skinConcerns: { acne: 0.8, darkSpots: 0.6 } },
    });
    expect(reply).toContain("salicylic-acid cleanser");
    expect(reply).toContain("vitamin-C serum");
  });

  it("handles makeup requests with season-specific base advice", () => {
    const reply = generateStylistReply("What lipstick and foundation should I use?", coolContext);
    expect(reply).toContain("Cool Winter");
    expect(reply).toMatch(/foundation/);
  });

  it("warns against colours on the avoid list", () => {
    const reply = generateStylistReply("Which colours should I avoid?", warmContext);
    expect(reply).toContain("tend to dull your complexion");
    expect(reply).toContain("Warm Autumn");
    expect(reply).toContain("tiny accents at most");
  });

  it("answers which colours suit me using the palette", () => {
    const reply = generateStylistReply("What colours suit me best?", warmContext);
    expect(reply).toContain("Warm Autumn");
    expect(reply).toContain("warm undertone");
    expect(reply).toMatch(/The colours that flatter you most/);
  });

  it("styling an empty wardrobe points the user to save pieces", () => {
    const reply = generateStylistReply("Style my clothes, give me an outfit idea", {
      wardrobeItems: [],
    });
    expect(reply).toContain("wardrobe is still empty");
    expect(reply).toContain("Save a few pieces");
  });

  it("styling saved wardrobe items uses them as anchors", () => {
    const reply = generateStylistReply("Give me an outfit idea", {
      analysisResult: { colourSeason: "Soft Summer" },
      wardrobeItems: [{ name: "Linen Shirt", palette: ["#F4F1EA"] }, { name: "Wide Trousers" }],
    });
    expect(reply).toContain("Linen Shirt");
    expect(reply).toContain("Wide Trousers");
    expect(reply).toContain("Soft Summer");
  });

  it("greets with the stylist identity", () => {
    const reply = generateStylistReply("hi", warmContext);
    expect(reply).toContain("D'Style");
  });

  it("detects a common colour and matches its temperature to the undertone", () => {
    const yes = generateStylistReply("Is red good for me?", warmContext);
    expect(yes).toContain("same family as your undertone");
    const no = generateStylistReply("Is red good for me?", coolContext);
    expect(no).toContain("can fight your cool undertone");
  });

  it("falls back gracefully on unknown input", () => {
    const reply = generateStylistReply("asdf qwerty", warmContext);
    expect(reply).toContain("Warm Autumn");
    expect(reply).toContain("flatter you");
  });
});
