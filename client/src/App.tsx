import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
};

type Toast = {
  message: string;
  type: "success" | "error";
};

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const showToast = (message: string, type: Toast["type"] = "error") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  // GET: Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/api/contacts`);

      setContacts(response.data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts when page loads
  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // POST / PUT: Create or update contact
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      showToast("Please fill all fields", "error");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(formData.phone)) {
      showToast("Please enter a valid 10-digit phone number", "error");
      return;
    }

    // If editing and no changes were made, close modal without updating
    if (editingId) {
      const originalContact = contacts.find(
        (contact) => contact._id === editingId,
      );

      if (
        originalContact &&
        originalContact.name === formData.name &&
        originalContact.email === formData.email &&
        originalContact.phone === formData.phone
      ) {
        setShowModal(false);
        setEditingId(null);
        return;
      }
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/contacts/${editingId}`, formData);

        showToast("Contact updated successfully", "success");
      } else {
        await axios.post(`${API_URL}/api/contacts`, formData);

        showToast("Contact added successfully", "success");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
      });

      setEditingId(null);
      setShowModal(false);

      fetchContacts();
    } catch (error) {
      console.error("Failed to save contact:", error);
      showToast("Failed to save contact. Please try again.", "error");
    }
  };

  // PUT: Edit an existing contact
  const handleEdit = (contact: Contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });

    setEditingId(contact._id);
    setShowModal(true);
  };

  // DELETE: Delete selected contact after custom confirmation
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`${API_URL}/api/contacts/${deleteId}`);

      showToast("Contact deleted successfully", "success");
      setDeleteId(null);
      fetchContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
      showToast("Failed to delete contact. Please try again.", "error");
    }
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
    });

    setEditingId(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FBF6F0] px-4 py-5 sm:px-6 lg:px-10">
      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-4 z-[70] w-fit max-w-[calc(100vw-32px)]">
          <div
            className={`inline-flex w-fit max-w-full items-center justify-center gap-3 rounded-2xl border px-4 py-3.5 shadow-lg ${
              toast.type === "success"
                ? "border-[#E8DCCF] bg-white text-[#3E2723]"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            <div
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                toast.type === "success" ? "bg-[#8D5B3F]" : "bg-red-500"
              }`}
            >
              {toast.type === "success" ? "✓" : "!"}
            </div>

            <p className="text-center text-sm font-medium leading-snug">
              {toast.message}
            </p>

            <button
              onClick={() => setToast(null)}
              className="text-lg leading-none text-current opacity-50 transition hover:opacity-100"
              aria-label="Dismiss notification"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1180px]">
        {/* Navbar */}
        <nav className="flex flex-col gap-5 rounded-[24px] border border-[#E8DCCF] bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3E2723] text-xl font-extrabold text-white">
              C
            </div>

            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-[#3E2723]">
                Contact Book
              </h1>

              <p className="text-sm text-[#8D7B70]">
                Simple contact management
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="w-full rounded-xl bg-[#3E2723] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2C1B18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8D5B3F] focus-visible:outline-offset-2 sm:w-auto"
          >
            + Add Contact
          </button>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden px-3 pb-10 pt-16 text-center sm:px-6 sm:pb-14 sm:pt-20">
          <div className="relative">
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#3E2723] sm:text-5xl md:text-6xl">
              Manage Your
              <br />
              <span className="inline-block rounded-xl bg-[#8D5B3F] px-2 py-1 text-white shadow-lg sm:px-5">
                Contacts
              </span>
              <br />
              In One Place
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8D7B70] sm:text-base">
              Add, update, view, and manage your contacts through a simple and
              organized contact management dashboard.
            </p>
          </div>
        </section>

        {loading && (
          <p className="mb-4 text-sm text-[#8D7B70]">Loading contacts...</p>
        )}

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {/* Table Card */}
        <section className="overflow-hidden rounded-2xl border border-[#E8DCCF] bg-white shadow-lg">
          <div className="flex flex-col gap-4 border-b border-[#F0E6D8] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#3E2723]">
                Your Contacts
              </h2>

              <p className="mt-1 text-sm text-[#8D7B70]">
                View and manage your saved contacts.
              </p>
            </div>
            
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[650px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-[#F0E6D8] bg-[#FAF3EC] px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#8D7B70] sm:px-6">
                    Name
                  </th>

                  <th className="border-b border-[#F0E6D8] bg-[#FAF3EC] px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#8D7B70] sm:px-6">
                    Email
                  </th>

                  <th className="border-b border-[#F0E6D8] bg-[#FAF3EC] px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#8D7B70] sm:px-6">
                    Phone
                  </th>

                  <th className="border-b border-[#F0E6D8] bg-[#FAF3EC] px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#8D7B70] sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {contacts.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-14 text-center text-sm text-[#8D7B70]"
                    >
                      No contacts found. Add your first contact.
                    </td>
                  </tr>
                )}

                {contacts.map((contact, index) => (
                  <tr
                    key={contact._id}
                    className="transition hover:bg-[#FAF3EC]"
                  >
                    <td
                      className={`px-4 py-4 text-sm text-[#3E2723] sm:px-6 ${
                        index !== contacts.length - 1
                          ? "border-b border-[#F0E6D8]"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0E0CC] text-sm font-bold text-[#8D5B3F]">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>

                        <span className="font-semibold">{contact.name}</span>
                      </div>
                    </td>

                    <td
                      className={`break-all px-4 py-4 text-sm text-[#8D7B70] sm:px-6 ${
                        index !== contacts.length - 1
                          ? "border-b border-[#F0E6D8]"
                          : ""
                      }`}
                    >
                      {contact.email}
                    </td>

                    <td
                      className={`px-4 py-4 text-sm text-[#8D7B70] sm:px-6 ${
                        index !== contacts.length - 1
                          ? "border-b border-[#F0E6D8]"
                          : ""
                      }`}
                    >
                      {contact.phone}
                    </td>

                    <td
                      className={`px-4 py-4 text-sm sm:px-6 ${
                        index !== contacts.length - 1
                          ? "border-b border-[#F0E6D8]"
                          : ""
                      }`}
                    >
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(contact)}
                          className="rounded-lg border border-[#E8DCCF] bg-[#FAF3EC] px-3 py-2 text-xs font-semibold text-[#8D5B3F] transition hover:border-[#8D5B3F] hover:bg-[#F0E0CC]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteId(contact._id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Contact Cards */}
          <div className="space-y-3 p-4 md:hidden">
            {contacts.length === 0 && !loading ? (
              <div className="py-10 text-center text-sm text-[#8D7B70]">
                No contacts found. Add your first contact.
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="rounded-2xl border border-[#E8DCCF] bg-[#FAF3EC] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0E0CC] font-bold text-[#8D5B3F]">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-[#3E2723]">
                        {contact.name}
                      </h3>

                      <p className="mt-1 break-all text-sm text-[#8D7B70]">
                        {contact.email}
                      </p>

                      <p className="mt-1 text-sm text-[#8D7B70]">
                        {contact.phone}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-[#E8DCCF] pt-3">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="flex-1 rounded-lg border border-[#E8DCCF] bg-white px-3 py-2 text-xs font-semibold text-[#8D5B3F] transition hover:bg-[#F0E0CC]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(contact._id)}
                      className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3E2723]/40 p-4 backdrop-blur-sm sm:p-6">
            <div className="relative w-full max-w-[460px] overflow-hidden rounded-[24px] border border-[#E8DCCF] bg-white p-5 shadow-2xl sm:p-7">
              <div className="pointer-events-none absolute -right-16 -top-16 h-[180px] w-[180px] rounded-full bg-[#E8DCCF]/60 blur-[90px]" />

              <div className="pointer-events-none absolute -bottom-16 -left-16 h-[160px] w-[160px] rounded-full bg-[#D8C3A5]/40 blur-[90px]" />

              <div className="relative">
                <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[1.8px] text-[#8D5B3F]">
                  Contact Details
                </p>

                <h2 className="text-2xl font-extrabold tracking-tight text-[#3E2723]">
                  {editingId ? "Edit Contact" : "Add Contact"}
                </h2>

                <p className="mt-2 text-sm text-[#8D7B70]">
                  Enter the contact details below.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 flex flex-col gap-3.5"
                >
                  <input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E8DCCF] bg-[#FAF3EC] px-4 py-3 text-sm outline-none focus:border-[#8D5B3F]"
                  />

                  <input
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E8DCCF] bg-[#FAF3EC] px-4 py-3 text-sm outline-none focus:border-[#8D5B3F]"
                  />

                  <input
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#E8DCCF] bg-[#FAF3EC] px-4 py-3 text-sm outline-none focus:border-[#8D5B3F]"
                  />

                  <button
                    type="submit"
                    className="mt-1.5 rounded-xl bg-[#3E2723] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2C1B18]"
                  >
                    {editingId ? "Update Contact" : "Save Contact"}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-[#E8DCCF] bg-[#FAF3EC] px-4 py-3 text-sm font-semibold text-[#8D7B70] hover:bg-white"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#3E2723]/40 p-5 backdrop-blur-sm">
            <div className="w-full max-w-[400px] rounded-[24px] border border-[#E8DCCF] bg-white p-6 shadow-2xl sm:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl font-bold text-red-500">
                !
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-[#3E2723]">
                Delete Contact?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#8D7B70]">
                Are you sure you want to delete this contact? This action cannot
                be undone.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setDeleteId(null)}
                  className="rounded-xl border border-[#E8DCCF] bg-[#FAF3EC] px-5 py-3 text-sm font-semibold text-[#8D7B70] transition hover:border-[#8D5B3F] hover:bg-white hover:text-[#3E2723]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
