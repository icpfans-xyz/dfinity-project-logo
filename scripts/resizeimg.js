const fs = require('fs')
const path = require('path')
const sizeOf = require('image-size')
const resizeImg = require('resize-img')


const RESIZE_WIDTH = 128
const RESIZE_HEIGHT = 128

const targetFolder = 'project' // project

const projectImgDirPath = path.resolve(__dirname, `../${targetFolder}/`)


async function convertImage(imageFile) {
    try {
        const imageFilePath = path.resolve(__dirname, `../${targetFolder}/` + imageFile)

        const imageSize = await sizeOf(imageFilePath)

        const imageFileExt= imageFile.split('.')[1]

        if (imageSize.width !== RESIZE_WIDTH || imageSize.height !== RESIZE_HEIGHT || imageFileExt !== 'png') {
            const imageFileName = imageFile.split('.')[0]

            const image = await resizeImg(fs.readFileSync(imageFilePath), {
                width: RESIZE_WIDTH,
                height: RESIZE_HEIGHT,
                format: 'png'
            })

            // write to png file
            fs.writeFileSync(
                path.resolve(__dirname, `../${targetFolder}/` + imageFileName + '.png'),
                image
            )

            console.log(`${imageFile} resize to ${RESIZE_WIDTH}x${RESIZE_HEIGHT} success.`)
        }
    } catch (err) {
        console.log(err)
    }
}

fs.readdir(projectImgDirPath, (err, files) => {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err)
    }
    //listing all files using forEach
    files.forEach(async function (file) {
        try {
            convertImage(file)
        } catch (err) {
            console.log(err)
        }
    })
})
