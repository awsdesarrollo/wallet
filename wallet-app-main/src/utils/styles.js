import Fonts from './fonts';
import Colors from "./colors";

export default {
    INPUT: {
        BORDER_RADIUS: 6,
        INPUT: {
            backgroundColor: Colors.white,
            borderRadius: 20,
            paddingLeft: 10,
            fontFamily: Fonts.REGULAR
        }
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    reset: {
        fontFamily: Fonts.BOLD,
        margin: 10,
        fontSize: 12
    },
    modal: {
        padding: 10,
        width: '85%',
        overflow: 'hidden',
        maxHeight: '90%'
    },
    search_header: {
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        backgroundColor: Colors.orange,
        paddingBottom: 15
    }
}