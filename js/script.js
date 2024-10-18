document.addEventListener('DOMContentLoaded', () => {
  const adminForm = document.getElementById('adminForm');
  const userForm = document.getElementById('userForm');
  const statusDisplay = document.getElementById('statusDisplay');
  const dataTable = document.getElementById('dataTable');

  if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const contract = document.getElementById('contract').value || '';
      const vkk = document.getElementById('vkk').value || '';
      const conclusion = document.getElementById('conclusion').value || '';
      const payment = document.getElementById('payment').value || '';

      const userData = { username, contract, vkk, conclusion, payment };

      const { data, error } = await supabase
        .from('users')
        .upsert(userData);

      if (error) {
        console.error('Error updating user data:', error);
      } else {
        adminForm.reset();
        alert('User information updated!');
      }
    });
  }

  if (userForm) {
    userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        statusDisplay.innerHTML = `<p>No data found for ${username}</p>`;
      } else {
        statusDisplay.innerHTML = `<h2>Status for ${username}</h2>`;
        statusDisplay.innerHTML += `
          <p>Договор: ${data.contract}</p>
          <p>ВКК: ${data.vkk}</p>
          <p>Заключение: ${data.conclusion}</p>
          <p>Ожидание оплаты: ${data.payment}</p>
        `;
      }
    });
  }

  if (dataTable) {
    const loadTableData = async () => {
      const tbody = dataTable.querySelector('tbody');
      tbody.innerHTML = ''; // Clear existing data

      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        data.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.contract}</td>
            <td>${user.vkk}</td>
            <td>${user.conclusion}</td>
            <td>${user.payment}</td>
          `;
          tbody.appendChild(row);
        });
      }
    };

    loadTableData(); // Call the async function to load data
  }
});
