var mongoose = require("mongoose")
var myFunction = require("./models/campground.js")
var Comment = myFunction.Comment
var Campground = myFunction.Campground

var data = [
    {
        name:"Campfires",
        image:"https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b014459df8c77ba4edb3_340.jpg",
        description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus soluta natus molestiae eaque? Libero tempore cupiditate commodi, autem incidunt itaque tenetur natus! Aperiam quos commodi ad deserunt quas, perferendis dolores!"
    },
    {
        name:"Cookery pots",
        image:"https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f8c97fa5eeb5be_340.jpg",
        description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus soluta natus molestiae eaque? Libero tempore cupiditate commodi, autem incidunt itaque tenetur natus! Aperiam quos commodi ad deserunt quas, perferendis dolores!"
    },
    {
        name:"Community camping",
        image:"https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg",
        description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus soluta natus molestiae eaque? Libero tempore cupiditate commodi, autem incidunt itaque tenetur natus! Aperiam quos commodi ad deserunt quas, perferendis dolores!"
    },
]

function seedDB(){
    Campground.deleteMany({},function(err){
        if(err){
            console.log(err)
        }else{
            console.log("All Campgrounds have been removed")
             data.forEach(function(seed){
                Campground.create(seed,function(err,campground){
                    if(err){
                        console.log(err)
                    }else{
                        console.log("Added another campground")
                        Comment.create({
                            text:"A great place to be in",
                            author:"Illiad"
                        },function(err,comment){
                            if(err){
                                console.log(err)
                            }else{
                                campground.comments.push(comment)
                                campground.save()
                                console.log("Added new Comment")
                            }
                        })

                    }
                })
            })
        }
    })
}
module.exports = seedDB;
