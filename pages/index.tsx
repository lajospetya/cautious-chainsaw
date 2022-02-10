import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { prisma } from '../lib/prisma';

interface Notes {
  notes: {
    id: string;
    title: string;
    content: string;
  }[];
}

interface FormData {
  title: string;
  content: string;
  id: string;
}

const Home = ({ notes }: Notes) => {
  const [form, setForm] = useState<FormData>({
    title: '',
    content: '',
    id: '',
  });
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function create(data: FormData) {
    try {
      fetch('http://menoauto.vercel.app/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }).then(() => {
        if (data.id) {
          deleteNote(data.id);
          setForm({ title: '', content: '', id: '' });
          refreshData();
        } else {
          setForm({ title: '', content: '', id: '' });
          refreshData();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteNote(id: string) {
    try {
      fetch(`http://menoauto.vercel.app/api/note/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      }).then(() => {
        refreshData();
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      if (data.content == '' || data.title == '') {
        console.log('Buz');
      } else {
        create(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-8/12 m-auto bg-white  rounded-xl bg-opacity-60 backdrop-filter backdrop-blur-lg">
      <h1 className="my-8 p-8 text-center font-bold text-4xl text-slate-900">
        Very open source véleménykinyílvánító oldal, amíg nincs rendes Kylans
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(form);
        }}
        className="w-8/12  mx-auto space-y-6 flex flex-col items-stretch"
      >
        <input
          type="text"
          placeholder="Cím"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border-2 bg-slate-800 border-slate-900 p-4"
        />
        <textarea
          placeholder="Leírás"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border-2 bg-slate-800  border-slate-900 p-4"
        />
        <button
          type="submit"
          className="w-8/12 mx-auto border-2 bg-slate-900 hover:border-slate-900 shadow-lg hover:text-slate-900 hover:text-slate-900 hover:bg-transparent p-1 active:border-white transition"
        >
          Hozzáadás
        </button>
      </form>
      <div className="w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch">
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="border-t border-white  p-12 my-8">
              <div className="flex justify-between">
                <div className="flex-1 border-r-4 p-4 border-slate-900">
                  <h3 className="font-bold text-2xl text-black">
                    {note.title}
                  </h3>
                  <p className="text-lg text-black">{note.content}</p>
                </div>

                <button
                  onClick={() =>
                    setForm({
                      title: note.title,
                      content: note.content,
                      id: note.id,
                    })
                  }
                  className="w-8/12 mx-auto border-2 bg-slate-900 hover:border-slate-900 p-4 mx-3 shadow-lg hover:text-slate-900 hover:text-slate-900 hover:bg-transparent p-1 active:border-white transition"
                >
                  Módosítás
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="w-8/12 mx-auto border-2 bg-red-900 hover:border-red-900 p-4 mx-1 shadow-lg hover:text-red-900 hover:text-red-900 hover:bg-transparent p-1 active:border-white transition"
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      id: true,
      content: true,
    },
  });

  return {
    props: {
      notes,
    },
  };
};
