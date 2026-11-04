import Foundation
import Vision
import CoreImage
import AppKit

// pakai: potong_latar <masuk> <keluar.png>  — potong latar (Vision: VNGenerateForegroundInstanceMaskRequest, macOS 14+) → PNG transparan
let args = CommandLine.arguments
guard args.count == 3, let ci = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else { print("pakai: potong_latar masuk keluar.png"); exit(1) }
let req = VNGenerateForegroundInstanceMaskRequest()
let h = VNImageRequestHandler(ciImage: ci)
try h.perform([req])
guard let r = req.results?.first else { print("tidak ada objek terdeteksi"); exit(2) }
let buf = try r.generateMaskedImage(ofInstances: r.allInstances, from: h, croppedToInstancesExtent: false)
let out = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
try ctx.writePNGRepresentation(of: out, to: URL(fileURLWithPath: args[2]), format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("ok", Int(out.extent.width), Int(out.extent.height))
