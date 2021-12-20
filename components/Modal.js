import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { CameraIcon, ExclamationIcon } from "@heroicons/react/outline";
import { db, storage } from "../firebase";
import {
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  collection,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { useSession } from "next-auth/react";

const Modal = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const cancelButtonRef = useRef(null);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const uploadPost = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    // create post and add to firestore 'posts' collection
    // get the post ID for the newly created post
    // upload the image to firebase storage with the post ID
    //get a download URL from fb storage and update the original post with image

    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });
    console.log("new doc added", docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
    );
    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {selectedFile ? (
                <img
                  src={selectedFile}
                  className="w-full object-contain cursor-pointer"
                  onclick={() => setSelectedFile(null)}
                  alt=""
                />
              ) : (
                <div
                  onClick={() => filePickerRef.current.click()}
                  className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                >
                  <CameraIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
              )}

              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"></div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Upload a Photo
                    </Dialog.Title>
                    <div>
                      <input
                        ref={filePickerRef}
                        type="file"
                        hidden
                        onChange={addImageToPost}
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Enter a caption</p>
                    </div>
                    <div className="mt-2">
                      <input
                        className="border-none focus:ring-0 w-full text-center"
                        type="text"
                        placeholder="Please enter a caption..."
                        ref={captionRef}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  disabled={!selectedFile}
                  onClick={uploadPost}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2
                        bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                        sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300 "
                >
                  Upload Post{loading ? "Uploading..." : "upload Post"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>

    // <Transition.Root show={open} as={Fragment}>
    //   <Dialog
    //     as="div"
    //     className="fixed z-10 insert-0 overflow-y-auto"
    //     onClose={setOpen}
    //   >
    //     <div className="flex item-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:bklock sm:p-0">
    //       <Transition.Child
    //         as={Fragment}
    //         enter="ease-out duration-300"
    //         enterFrom="opacity-0"
    //         enterTo="opacity-100"
    //         leave="ease-in duration-200"
    //         leaveFrom="opacity-100"
    //         leaveTo="opacity-0"
    //       >
    //         <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
    //       </Transition.Child>

    //       {/* This element is to trick the browser into cenerting the modal contents */}
    //       <span
    //         className="hidden sm:inline-block sm:align-middle sm:h-screen"
    //         aria-hidden="true"
    //       >
    //         &#8203;
    //       </span>
    //       <Transition.Child
    //         as={Fragment}
    //         enter="ease-out duration-300"
    //         enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    //         enterTo="opacity-100 translate-y-0 sm:scale-100"
    //         leave="ease-in duration-200"
    //         leaveFrom="opacity-100"
    //         leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    //       >
    //         <div
    //           className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left
    //        overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6
    //        "
    //         >
    //           <div>
    //             <div className="mt-3 text-center sm:mt-5">
    //               <Dialog.Title
    //                 as="h3"
    //                 className="text-lg leading-6 font-medium text-gray-900"
    //               >
    //                 Upload a photo
    //               </Dialog.Title>
    //             </div>
    // <div className="mt-5 sm:mt-6">
    //   <button
    //     type="button"
    //     className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2
    //         bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
    //         sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300 "
    //   >
    //     Upload Post
    //   </button>
    // </div>
    //           </div>
    //           <h1>Hello</h1>
    //         </div>
    //       </Transition.Child>
    //     </div>
    //   </Dialog>
    // </Transition.Root>
  );
};

export default Modal;
