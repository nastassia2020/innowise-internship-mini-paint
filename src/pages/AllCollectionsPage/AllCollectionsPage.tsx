import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { getAllCollections } from '../../features/allCollections/AllCollectionsSlice'
import { getAllUsers } from '../../features/allUsers/allUsersSlice'

import './AllCollectionsPage.css'

export interface StoredUser {
  email: string
  uid: string
}

function AllCollectionsPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const collections = useAppSelector((state) => state.userCollections)
  const usersFromDB = useAppSelector((state) => state.users)
  const [search, setSearch] = useState('')

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    dispatch(getAllCollections())
    dispatch(getAllUsers())
  }, [dispatch])

  const usersCollections = usersFromDB.users.map(({ email }) => ({
    email,
    data: collections.collections
      .filter(({ uid }) => uid === usersFromDB.users.find((user) => user.email === email)?.uid)
      .map(({ drawingData }) => drawingData.dataURL),
  }))

  return (
    <div className='collection-list'>
      <h2>All collections</h2>
      <button className='drawings-list-btn' type='button' onClick={() => navigate('/')}>
        Return to canvas
      </button>
      <input
        type='text'
        title='search'
        placeholder='Enter user name'
        onChange={changeHandler}
        className='search-input'
      />

      {search.length > 0
        ? usersCollections
            .filter((user) => user.email.includes(search))
            .map((user) => (
              <div className='user-collection' key={user.data[0] + 'tt'}>
                <p className='drawing-collection-p' key={user.data[0] + 'tt'}>
                  {user.email}
                </p>
                <div className='drawing-collection'>
                  {user.data.slice(-1).map((drawing) => (
                    <img className='drawing' key={user.data[1] + 'tt'} src={drawing} alt={`Drawing ${drawing}`} />
                  ))}
                </div>
              </div>
            ))
        : usersCollections.map((user) => (
            <div className='user-collection' key={user.data[0]}>
              <p className='drawing-collection-p' key={user.data[0]}>
                {user.email}
              </p>
              <div className='drawing-collection'>
                {user.data.slice(-1).map((drawing) => (
                  <img className='drawing' key={user.data[1]} src={drawing} alt={`Drawing ${drawing}`} />
                ))}
              </div>
            </div>
          ))}
    </div>
  )
}

export default AllCollectionsPage
