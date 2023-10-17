"use client";

import { useEffect,useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


import Profile from "@components/Profile";

function MyProfile () {

    const {data:session} = useSession()

    const [posts,setPosts] = useState([])

    const router = useRouter()

    useEffect(()=>{
        const fetchPost = async () =>{
          const response = await fetch(`/api/users/${session?.user.id}/posts`)
          const data = await response.json()
          setPosts(data)
        }
        if (session?.user.id) fetchPost()
      },[])
      
  
    const handleEdit = async (post) =>{
        router.push(`/update-prompt?id=${post._id}`)
    }

    const handleDelete = async (post) =>{
        const hasConfirmed = confirm("Are you sure you want to delete it ?")

        if (hasConfirmed) {
          try {
            await fetch(`/api/prompt/${post._id.toString()}`,
              {method:'DELETE'}
            )

            const filteredPosts = posts.filter((p)=>{
                p._id !== post.id
            })

            setPosts(filteredPosts)

          } catch(err) {

          }
           
        }
    }
  
    return (
   <Profile
        name="My"
        desc="welcome"
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
   />
  )
}

export default MyProfile 