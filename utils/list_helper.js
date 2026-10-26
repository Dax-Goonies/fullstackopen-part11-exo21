// Dummy function
const dummy = (blogs) => {
  return 1
}

// Total Likes function
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

// Favorite Blog function
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    return blogs.reduce((max, blog) =>
        blog.likes > max.likes ? blog : max
    )
}

// Most Blog function
const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const counts = {}
    blogs.forEach(blog => {
        counts[blog.author] = (counts[blog.author] || 0) + 1
    })

    const topAuthor = Object.keys(counts).reduce((a, b) => 
        counts[a] > counts[b] ? a : b
    )

    return { 
        author: topAuthor,
        blogs: counts[topAuthor]
    }
}

// Most Likes function
const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const likesByAuthor = {}
    blogs.forEach(blog => {
        likesByAuthor[blog.author] = (likesByAuthor[blog.author] || 0) + blog.likes
    })

    const topAuthor = Object.keys(likesByAuthor).reduce((a, b) => 
        likesByAuthor[a] > likesByAuthor[b] ? a : b
    )

    return {
        author: topAuthor,
        likes: likesByAuthor[topAuthor]
    }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}