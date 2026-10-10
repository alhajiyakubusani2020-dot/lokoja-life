# -*- coding: utf-8 -*-
"""Merge cover + body into the final report PDF, normalized to A4."""
from pypdf import PdfReader, PdfWriter

A4_W, A4_H = 595.28, 841.89

def normalize(page):
    w, h = float(page.mediabox.width), float(page.mediabox.height)
    if abs(w - A4_W) > 0.1 or abs(h - A4_H) > 0.1:
        page.scale_to(A4_W, A4_H)
        page.mediabox.lower_left = (0, 0)
        page.mediabox.upper_right = (A4_W, A4_H)
    return page

writer = PdfWriter()
writer.add_page(normalize(PdfReader("/home/z/my-project/research/cover.pdf").pages[0]))
for p in PdfReader("/home/z/my-project/research/report_body.pdf").pages:
    writer.add_page(normalize(p))
writer.add_metadata({
    "/Title": "Lokoja Life - Competitor Research and Product Comparison",
    "/Author": "Z.ai",
    "/Creator": "Z.ai",
    "/Subject": "Phase 0 competitor research: Lagos Life vs Lokoja Life",
})
OUT = "/home/z/my-project/download/Lokoja_Life_Competitor_Research_Report.pdf"
with open(OUT, "wb") as f:
    writer.write(f)
print("MERGED", OUT)
