
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import javax.swing.JOptionPane;



public class Conexion {
    
    public static Connection darConexion()
    {
        String urlBD="jdbc:mysql://localhost/mirancho?";
        String usuarioBD = "admin";
        String passBD = "ingsoftware1";
        Connection con = null;
        try{
            con = DriverManager.getConnection(urlBD,usuarioBD,passBD);
            return con;
        } catch (SQLException ex)
        {
            JOptionPane.showMessageDialog(null, "No se puede hacer la conexion ala BD", "Conexión fallida", JOptionPane.WARNING_MESSAGE);
            return null;
        }
        
    }
}